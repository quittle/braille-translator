import { getKeyByValue } from "../utils";
import {
  BRAILLE_MAP,
  BRAILLE_WORD_SIGNS,
  NUMBER_LETTER_MAPPING,
} from "./braille-map";
import * as BrailleModifiers from "./braille-modifiers";

/** Represents a pip value, using the standard braille dot number system. */
export type Pip = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type InvalidCell = "?";
/** Represents a single character as either invalid or valid pips */
export type Cell = InvalidCell | ValidCell;
/** All possible valid pips in a c  */
export type ValidCell =
  | Readonly<[]>
  | Readonly<[Pip]>
  | Readonly<[Pip, Pip]>
  | Readonly<[Pip, Pip, Pip]>
  | Readonly<[Pip, Pip, Pip, Pip]>
  | Readonly<[Pip, Pip, Pip, Pip, Pip]>
  | Readonly<[Pip, Pip, Pip, Pip, Pip, Pip]>
  | Readonly<[Pip, Pip, Pip, Pip, Pip, Pip, Pip]>
  | Readonly<[Pip, Pip, Pip, Pip, Pip, Pip, Pip, Pip]>;

/**
 * Determines if two cells are equal. Note, this assumes the cell pips are both sorted.
 * @param a The first cell to compare
 * @param b The second cell to compare
 * @returns `true` if both cells are identical. `false otherwise.
 */
export function cellsEqual(a: Cell, b: Cell): boolean {
  if (a.length != b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i] != b[i]) {
      return false;
    }
  }

  return true;
}

/**
 * Attempts to parse a pip array into a `Cell`
 * @param pips The pip values
 * @returns The input array if it's a valid cell. If invalid, returns null.
 */
export function _tryParseCell(pips: ReadonlyArray<number>): Cell | null {
  // Can only include up to 8 pips
  if (pips.length > 8) {
    return null;
  }

  // All pips must be between 1 and 8, inclusive, and be integers
  if (
    pips.find((value) => value < 1 || value > 8 || !Number.isInteger(value)) !==
    undefined
  ) {
    return null;
  }

  // Duplicate entries aren't allowed
  if (new Set(pips).size != pips.length) {
    return null;
  }

  return pips as Cell;
}

/** Determines if a cell is valid or not */
export function _isValidCell(cell: Cell): cell is ValidCell {
  return cell !== "?";
}

/** Converts a cell to the uincode codepoint representing the cell */
export function _cellToUnicode(cell: Cell): string {
  if (!_isValidCell(cell)) {
    return cell;
  }

  const pipValue = (pip: Pip) =>
    (cell as ReadonlyArray<Pip>).includes(pip) ? 1 << (pip - 1) : 0;
  const pipBinary =
    pipValue(1) |
    pipValue(2) |
    pipValue(3) |
    pipValue(4) |
    pipValue(5) |
    pipValue(6) |
    pipValue(7) |
    pipValue(8);
  // This offset is the basis for calculating braille characters
  const brailleCodePoint = 0x2800 + pipBinary;
  return String.fromCodePoint(brailleCodePoint);
}

/**
 * Attempts to convert extract a wordsign from a string
 * @param string The string to convert
 * @returns `null` if a word sign does not fit. Otherwise, returns the cell for the wordsign and how
 * many characters were consumed by the wordsign.
 */
export function getWordSign(
  string: string
): null | { cell: Cell; length: number } {
  for (let i = 1; i < string.length; i++) {
    const char = string.charAt(i);
    if (char === " ") {
      return null;
    }
    const possibleWord = string.substring(0, i + 1);
    const possibleConversion = BRAILLE_WORD_SIGNS[possibleWord];
    if (possibleConversion !== undefined) {
      const cell =
        typeof possibleConversion === "string"
          ? BRAILLE_MAP[possibleConversion]
          : possibleConversion;
      if (i == string.length - 1 || string[i + 1] === " ") {
        return {
          length: i + 1,
          cell: cell,
        };
      }
    }
  }
  return null;
}

/**
 * Converts a number literal to the braille alphabetic character equivalent.
 * @param numberCharacter The number (as a string) to convert
 * @returns A string with a single alphabetic character or null if `character` is not a number.
 */
export function getNumberCharacter(numberCharacter: string): string | null {
  return NUMBER_LETTER_MAPPING[numberCharacter] ?? null;
}

/**
 * Determines if a character is uppercase in english.
 * @param character The character to check
 * @returns True if `character` is uppercase, otherwise false.
 */
export function isUppercaseCharacter(character: string) {
  const charCode = character.charCodeAt(0);
  // check between "A" and "Z"
  return charCode >= 65 && charCode <= 90;
}

/** Converts a string of latin characters to an array of braille cells */
export function _latinStringToCells(string: string): Array<Cell> {
  const ret: Cell[] = [];

  let curState: "number" | "uppercase" | null = null;
  for (let i = 0; i < string.length; i++) {
    let character = string.charAt(i);

    const numberCharacter = getNumberCharacter(character);
    if (numberCharacter !== null) {
      if (curState !== "number") {
        ret.push(BrailleModifiers.NUMBER);
        curState = "number";
      }
      character = numberCharacter;
    } else if (isUppercaseCharacter(character)) {
      if (curState === "number") {
        ret.push(BrailleModifiers.LETTER_SIGN);
      }
      if (curState !== "uppercase") {
        const getOffsetOfEndOfUppercase = (
          string: string,
          startingOffset: number
        ): number | null => {
          let offset = startingOffset;
          while (offset < string.length) {
            const curChar = string.charAt(offset);
            if (curChar === " ") {
              return offset;
            }
            if (!isUppercaseCharacter(curChar)) {
              return null;
            }
            offset++;
          }
          return offset;
        };
        const endOfUppercaseOffset = getOffsetOfEndOfUppercase(string, i);
        if (endOfUppercaseOffset == null || endOfUppercaseOffset - i <= 2) {
          ret.push(BrailleModifiers.UPPER_CASE_LETTER);
        } else {
          curState = "uppercase";
          ret.push(...BrailleModifiers.UPPER_CASE_WORD);
        }
      }
      character = character.toLowerCase();
    } else {
      if (character != " " && curState === "number") {
        ret.push(BrailleModifiers.LETTER_SIGN);
        curState = null;
      }

      const wordSign = getWordSign(string.substring(i));
      if (wordSign !== null) {
        ret.push(wordSign.cell);
        i += wordSign.length;
        continue;
      }

      curState = null;
    }

    ret.push(BRAILLE_MAP[character] || "?");
  }
  return ret;
}

/**
 * Checks if a cell is a space
 * @param cell The cell to check.
 * @returns `true` if the cell is a space, otherwise returns `false`.
 */
function isSpaceCell(cell: Cell): boolean {
  return cellsEqual(BRAILLE_MAP[" "], cell);
}

/**
 * Determines if the cell at `offset` in `braille` can be considered a word
 * @param braille The full braille text
 * @param offset The offset into the braille text
 * @returns `true` if at a boundary or the beginning or end of the word. Otherwise `false`.
 */
function isCellAtWordBoundary(
  braille: ReadonlyArray<Cell>,
  offset: number
): boolean {
  if (offset !== 0 && !isSpaceCell(braille[offset - 1])) {
    return false;
  }

  if (offset != braille.length - 1 && !isSpaceCell(braille[offset + 1])) {
    return false;
  }
  return true;
}

/**
 * Converts an array of braille cells to text.
 * @param braille The braille to convert
 * @returns The translated text. `?` are substituted for unrecognized cells.
 */
export function _cellsToText(braille: readonly Cell[]): Array<[string, Cell]> {
  const ret: Array<[string, Cell]> = [];

  let state: "number" | null = null;
  for (let i = 0; i < braille.length; i++) {
    const inputCell = braille[i];

    const char = getKeyByValue(BRAILLE_MAP, (cell) =>
      cellsEqual(inputCell, cell)
    );

    if (char) {
      if (char === " ") {
        state = null;
      } else if (state === "number") {
        const number = getKeyByValue(NUMBER_LETTER_MAPPING, char);
        if (number === null) {
          ret.push(["?", inputCell]);
        } else {
          ret.push([number, inputCell]);
        }
        continue;
      }
      if (isCellAtWordBoundary(braille, i)) {
        const wordsign = getKeyByValue(BRAILLE_WORD_SIGNS, (stringOrCell) => {
          const cell =
            typeof stringOrCell === "string"
              ? BRAILLE_MAP[stringOrCell]
              : stringOrCell;

          return cellsEqual(cell, inputCell);
        });
        if (wordsign !== null) {
          ret.push([wordsign, inputCell]);
          continue;
        }
      }
      ret.push([char, inputCell]);
      continue;
    }

    if (cellsEqual(inputCell, BrailleModifiers.NUMBER)) {
      state = "number";
      ret.push(["", inputCell]);
      continue;
    }

    if (cellsEqual(inputCell, BrailleModifiers.LETTER_SIGN)) {
      state = null;
      ret.push(["", inputCell]);
      continue;
    }

    ret.push(["?", inputCell]);
  }
  return ret;
}
