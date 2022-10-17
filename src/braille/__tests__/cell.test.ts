import { tryParseCell } from "../cell";

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
});
