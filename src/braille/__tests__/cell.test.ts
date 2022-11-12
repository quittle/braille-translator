import { Cell, INVALID_CELL, tryParseCell } from "../cell";

describe("cell", () => {
  test("tryParseCell", () => {
    expect(tryParseCell([])).toStrictEqual([]);
    expect(tryParseCell([1, 3, 6])).toStrictEqual([1, 3, 6]);
    expect(tryParseCell([1, 2, 3, 4, 5, 6, 7, 8])).toStrictEqual([
      1, 2, 3, 4, 5, 6, 7, 8,
    ]);

    expect(tryParseCell([-1, 2, 3])).toBeNull();
    expect(tryParseCell([1.2, 3])).toBeNull();
    expect(tryParseCell([1, 1, 2])).toBeNull();
    expect(tryParseCell([1, 2, 3, 9])).toBeNull();
    expect(tryParseCell([0, 1, 2])).toBeNull();

    const originalCell = [1, 2, 3];
    const returnedCell = tryParseCell(originalCell);
    expect(originalCell).toBe(returnedCell);
  });

  test("literal Cell", () => {
    expect(Cell()).toStrictEqual([]);
    expect(Cell(1, 2)).toStrictEqual([1, 2]);
    expect(Cell(1, 2, 3)).toStrictEqual([1, 2, 3]);
    expect(Cell(8, 3)).toStrictEqual([8, 3]);
    expect(Cell(1, 1)).toBe(INVALID_CELL);
  });
});
