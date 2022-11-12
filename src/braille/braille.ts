import { Cell, isValidCell, Pip } from "./cell";

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
