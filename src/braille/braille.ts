import { getKeyByValue } from "../utils";
import {
  BRAILLE_MAP,
  BRAILLE_WORD_SIGNS,
  NUMBER_LETTER_MAPPING,
  ANYWHERE_LOWER_GROUP_SIGNS,
  WORD_BOUNDARY_CHARS,
} from "./braille-map";
import * as BrailleModifiers from "./braille-modifiers";
import { Cell, cellsEqual, isValidCell, Pip, ValidCell } from "./cell";

/** Converts a cell to the uincode codepoint representing the cell */
export function _cellToUnicode(cell: Cell): string {
  if (!isValidCell(cell)) {
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
    if (WORD_BOUNDARY_CHARS.includes(char)) {
      return null;
    }
    const possibleWord = string.substring(0, i + 1);
    const possibleCell = BRAILLE_WORD_SIGNS[possibleWord];
    if (possibleCell !== undefined) {
      if (
        i == string.length - 1 ||
        WORD_BOUNDARY_CHARS.includes(string[i + 1])
      ) {
        return {
          length: i + 1,
          cell: possibleCell,
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
            if (WORD_BOUNDARY_CHARS.includes(curChar)) {
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
      if (!WORD_BOUNDARY_CHARS.includes(character) && curState === "number") {
        ret.push(BrailleModifiers.LETTER_SIGN);
        curState = null;
      }

      const wordSign = getWordSign(string.substring(i));
      if (wordSign !== null) {
        ret.push(wordSign.cell);
        i += wordSign.length;
        i--; // Subtract to handle increment during loop
        continue;
      }

      const manyAnywhereLowerGroupSign = tryLatinToGroupSign(
        string.substring(i)
      );
      if (manyAnywhereLowerGroupSign !== null) {
        ret.push(manyAnywhereLowerGroupSign[0]);
        i += manyAnywhereLowerGroupSign[1];
        continue;
      }

      curState = null;
    }

    ret.push(BRAILLE_MAP[character] || "?");
  }
  return ret;
}

/**
 * Attempts to convert a cell into a group sign.
 * @param cell The cell to convert
 * @returns The latin string representation of the groupsign or `null` if not a group sign.
 */
function tryGroupSign(cell: Cell): string | null {
  return getKeyByValue(ANYWHERE_LOWER_GROUP_SIGNS, (groupSignCell) =>
    cellsEqual(cell, groupSignCell)
  );
}

/**
 * Attempts to convert the beginning of the text to a group sign
 * @param text The text to convert
 * @returns If `text` starts with a groupsign, returns a pair of the representative cell and the
 * length of the text consumed. Returns `null` if not a group sign.
 */
function tryLatinToGroupSign(text: string): [ValidCell, number] | null {
  const maybeEntry = Object.entries(ANYWHERE_LOWER_GROUP_SIGNS).find(
    ([groupSignText, _]) => text.startsWith(groupSignText)
  );
  if (maybeEntry == undefined) {
    return null;
  }
  return [maybeEntry[1], maybeEntry[0].length];
}

/**
 * Determines if the cell at `offset` in `braille` can be considered a word. This essentially checks
 * for the "standing alone" rule.
 * @param braille The full braille text
 * @param offset The offset into the braille text
 * @returns `true` if at a boundary or the beginning or end of the word. Otherwise `false`.
 */
function isCellAtWordBoundary(
  braille: ReadonlyArray<Cell>,
  offset: number
): boolean {
  const isWordBoundaryChar = (cell: Cell): boolean => {
    return WORD_BOUNDARY_CHARS.some((char) =>
      cellsEqual(BRAILLE_MAP[char], cell)
    );
  };

  if (offset !== 0 && !isWordBoundaryChar(braille[offset - 1])) {
    return false;
  }

  if (
    offset !== braille.length - 1 &&
    !isWordBoundaryChar(braille[offset + 1])
  ) {
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
      if (WORD_BOUNDARY_CHARS.includes(char)) {
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
        const wordsign = getKeyByValue(BRAILLE_WORD_SIGNS, (cell) => {
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

    const maybeGroupSign = tryGroupSign(inputCell);
    if (maybeGroupSign !== null) {
      ret.push([maybeGroupSign, inputCell]);
      continue;
    }

    ret.push(["?", inputCell]);
  }
  return ret;
}
