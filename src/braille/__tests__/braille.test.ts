import { cellToUnicode } from "../braille";

const BRAILLE_SPACE = "⠀";

describe("braille", () => {
  test("cellToUnicode", () => {
    expect(BRAILLE_SPACE).not.toBe(" ");
    expect(BRAILLE_SPACE.charCodeAt(0)).toBe(0x2800);
    expect(cellToUnicode([])).toStrictEqual(BRAILLE_SPACE);
    expect(cellToUnicode([1])).toBe("⠁");
    expect(cellToUnicode([1, 2, 3, 5])).toBe("⠗");
  });
});
