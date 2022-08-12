import { Cell, isValidCell, ValidCell } from "../braille";
import {
  BrailleModifiers,
  BRAILLE_MAP,
  BRAILLE_WORD_SIGNS,
} from "../braille-map";

describe("braille-map", () => {
  test.each([
    ...Object.entries(BRAILLE_MAP),
    ...Object.entries(BrailleModifiers),
    ...Object.entries(BRAILLE_WORD_SIGNS),
  ])(
    "Validate all cells for %p",
    (_name: string, cellOrCells: string | Cell | [Cell, Cell]) => {
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
    }
  );

  test("Unique latin characters", () => {
    const allCells: readonly Cell[] = Object.values(BRAILLE_MAP);
    for (let i = 0; i < allCells.length; i++) {
      const cell = allCells[i];
      expect([
        ...allCells.slice(0, i),
        ...allCells.slice(i + 1),
      ]).not.toContainEqual(cell);
    }
  });
});
