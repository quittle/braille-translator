import {
  cellToUnicode,
  isValidCell,
  latinStringToCells,
  tryParseCell,
} from "../";
import {
  getNumberCharacter,
  getWordSign,
  isUppercaseCharacter,
} from "../braille";

const BRAILLE_SPACE = "⠀";

describe("braille", () => {
  test("isValidCell", () => {
    expect(isValidCell([])).toBe(true);
    expect(isValidCell([1, 2, 3])).toBe(true);
    expect(isValidCell("?")).toBe(false);
  });

  test("cellToUnicode", () => {
    expect(BRAILLE_SPACE).not.toBe(" ");
    expect(BRAILLE_SPACE.charCodeAt(0)).toBe(0x2800);
    expect(cellToUnicode([])).toStrictEqual(BRAILLE_SPACE);
    expect(cellToUnicode([1])).toBe("⠁");
    expect(cellToUnicode([1, 2, 3, 5])).toBe("⠗");
  });

  test("getNumberCharacter", () => {
    expect(getNumberCharacter("1")).toBe("a");
    expect(getNumberCharacter("8")).toBe("h");
    expect(getNumberCharacter("0")).toBe("j");

    expect(getNumberCharacter("a")).toBeNull();
    expect(getNumberCharacter("")).toBeNull();
  });

  test("isUppercaseCharacter", () => {
    expect(isUppercaseCharacter("1")).toBe(false);
    expect(isUppercaseCharacter("+")).toBe(false);
    expect(isUppercaseCharacter("a")).toBe(false);
    expect(isUppercaseCharacter("A")).toBe(true);
    expect(isUppercaseCharacter("Z")).toBe(true);
  });

  describe("latinStringToCells", () => {
    test("empty", () => {
      expect(latinStringToCells("")).toStrictEqual([]);
    });

    test("space", () => {
      expect(latinStringToCells(" ")).toStrictEqual([[]]);
    });

    test("lowercase letters", () => {
      expect(latinStringToCells("a")).toStrictEqual([[1]]);
      expect(latinStringToCells("abc")).toStrictEqual([[1], [1, 2], [1, 4]]);
      expect(latinStringToCells("a b c")).toStrictEqual([
        [1],
        [],
        [1, 2],
        [],
        [1, 4],
      ]);
    });

    test("uppercase letters", () => {
      expect(latinStringToCells("A")).toStrictEqual([[6], [1]]);
      expect(latinStringToCells("ABC")).toStrictEqual([
        [6],
        [6],
        [1],
        [1, 2],
        [1, 4],
      ]);
      expect(latinStringToCells("A B C")).toStrictEqual([
        [6],
        [1],
        [],
        [6],
        [1, 2],
        [],
        [6],
        [1, 4],
      ]);

      expect(latinStringToCells("AB")).toStrictEqual([[6], [1], [6], [1, 2]]);

      expect(latinStringToCells("ABC DEF")).toStrictEqual([
        [6],
        [6],
        [1],
        [1, 2],
        [1, 4],

        [],

        [6],
        [6],
        [1, 4, 5],
        [1, 5],
        [1, 2, 4],
      ]);
    });

    test("numbers", () => {
      expect(latinStringToCells("1")).toStrictEqual([[3, 4, 5, 6], [1]]);
      expect(latinStringToCells("123")).toStrictEqual([
        [3, 4, 5, 6],
        [1],
        [1, 2],
        [1, 4],
      ]);
      expect(latinStringToCells("1 2 3")).toStrictEqual([
        [3, 4, 5, 6],
        [1],
        [],
        [3, 4, 5, 6],
        [1, 2],
        [],
        [3, 4, 5, 6],
        [1, 4],
      ]);
    });

    test("letter number mix", () => {
      expect(latinStringToCells("abc123DEF")).toStrictEqual([
        // abc
        [1],
        [1, 2],
        [1, 4],

        // 123
        [3, 4, 5, 6], // number sign
        [1],
        [1, 2],
        [1, 4],

        // DEF
        [5, 6], // letter sign
        [6], // word capitalize
        [6],
        [1, 4, 5],
        [1, 5],
        [1, 2, 4],
      ]);
    });
  });

  test("getWordSign", () => {
    expect(getWordSign("abc")).toBeNull();
    expect(getWordSign("do")).toStrictEqual({
      cell: [1, 4, 5],
      length: 2,
    });
    expect(getWordSign("do not")).toStrictEqual({
      cell: [1, 4, 5],
      length: 2,
    });
    expect(getWordSign("dont")).toBeNull();
  });

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
