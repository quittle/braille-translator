import { describe, expect, test } from "@jest/globals";
import { Cell, isValidCell, ValidCell } from "../";
import {
  ANYWHERE_LOWER_GROUP_SIGNS,
  BRAILLE_MAP,
  BRAILLE_WORD_SIGNS,
} from "../braille-map";
import * as BrailleModifiers from "../braille-modifiers";

describe("braille-map", () => {
  test.each([
    ...Object.entries(BRAILLE_MAP),
    ...Object.entries(BrailleModifiers),
    ...Object.entries(BRAILLE_WORD_SIGNS),
    ...Object.entries(ANYWHERE_LOWER_GROUP_SIGNS),
  ])(
    "validate all cells for %p",
    (_name: string, cellOrCells: Cell | [Cell, Cell]) => {
      if (typeof cellOrCells === "string") {
        expect(Object.keys(BRAILLE_MAP)).toContain(cellOrCells);

        return;
      }

      const cells =
        cellOrCells.length > 0 && Array.isArray(cellOrCells[0])
          ? cellOrCells
          : [cellOrCells];
      for (let cell of cells as Cell[]) {
        expect(isValidCell(cell)).toBe(true);

        cell = cell as ValidCell;

        expect(cell).toBeInstanceOf(Array);
        expect(cell).toStrictEqual([...cell].sort());

        for (const pip of cell) {
          expect(pip).toBeGreaterThanOrEqual(1);
          expect(pip).toBeLessThanOrEqual(8);
        }
      }

      // Guard against vacuous pass; also satisfies jest/prefer-ending-with-an-expect.
      expect(cells.length).toBeGreaterThan(0);
    }
  );

  test("unique latin characters", () => {
    const allCells: readonly Cell[] = Object.values(BRAILLE_MAP);
    const serializedCells = allCells.map((cell) => JSON.stringify(cell));

    expect(new Set(serializedCells).size).toBe(allCells.length);
  });
});
