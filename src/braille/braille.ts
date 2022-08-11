import { BrailleModifiers, BRAILLE_MAP } from "./braille-map";

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

/** Determines if a cell is valid or not */
export function isValidCell(cell: Cell): cell is ValidCell {
  return cell !== "?";
}

/** Converts a cell to the uincode codepoint representing the cell */
export function cellToUnicode(cell: Cell): string {
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
 * Converts a number literal to the braille alphabetic character equivalent.
 * @param character The character to convert
 * @returns A string with a single alphabetic character or null if `character` is not a number.
 */
export function getNumberCharacter(character: string): string | null {
  switch (character) {
    case "1":
      return "a";
    case "2":
      return "b";
    case "3":
      return "c";
    case "4":
      return "d";
    case "5":
      return "e";
    case "6":
      return "f";
    case "7":
      return "g";
    case "8":
      return "h";
    case "9":
      return "i";
    case "0":
      return "j";
    default:
      return null;
  }
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
export function latinStringToCells(string: string): Array<Cell> {
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
      curState = null;
    }

    ret.push(BRAILLE_MAP[character] || "?");
  }
  return ret;
}