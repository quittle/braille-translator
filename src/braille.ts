import { BrailleModifiers, BRAILLE_MAP } from "./braille-map";

/** Represents a pip value, using the standard braille dot number system. */
export type Pip = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
/** Represents a single character as either invalid or valid pips */
export type Cell = "?" | ValidCell;
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
  const brailleCodePoint = 10240 + pipBinary; // U+2800 is the offset
  return String.fromCodePoint(brailleCodePoint);
}

/** Covnerts a string of latin characters to an array of braille cells */
export function latinStringToCells(string: string): Array<Cell> {
  const ret: Cell[] = [];
  for (let i = 0; i < string.length; i++) {
    let character = string.charAt(i);
    if (character === character.toUpperCase()) {
      ret.push(BrailleModifiers.UPPER_CASE);
      character = character.toLowerCase();
    }
    ret.push(BRAILLE_MAP[character] || "?");
  }
  return ret;
}
