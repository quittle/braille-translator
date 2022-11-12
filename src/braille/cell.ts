import { filterNullish } from "../utils";

/** Represents a pip value, using the standard braille dot number system. */
export type Pip = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type InvalidCell = "?";
export const INVALID_CELL: InvalidCell = "?";
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
/** Represents a single character as either invalid or valid pips */
export type Cell = InvalidCell | ValidCell;

/**
 * Creates a cell, enforcing length and values nicer than an array literal
 * @returns The cell. If invalid, returns an InvalidCell`
 */
export function Cell(
  p1?: Pip,
  p2?: Pip,
  p3?: Pip,
  p4?: Pip,
  p5?: Pip,
  p6?: Pip,
  p7?: Pip,
  p8?: Pip
): Cell {
  return (
    tryParseCell(filterNullish([p1, p2, p3, p4, p5, p6, p7, p8])) ??
    INVALID_CELL
  );
}

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
export function tryParseCell(pips: ReadonlyArray<number>): Cell | null {
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
export function isValidCell(cell: Cell): cell is ValidCell {
  return cell !== INVALID_CELL;
}
