import {
  cellToUnicode,
  getNumberCharacter,
  getWordSign,
  isUppercaseCharacter,
  isValidCell,
  latinStringToCells,
} from "../braille";

const BRAILLE_SPACE = "⠀";

describe("braille", () => {
  test("isValidCell", () => {
    expect(isValidCell([])).toBe(true);
    expect(isValidCell([1, 2, 3])).toBe(true);
    expect(isValidCell("?")).toBe(false);
  });

  test("cellToUnicode", () => {
    expect(BRAILLE_SPACE).not.toStrictEqual(" ");
    expect(BRAILLE_SPACE.charCodeAt(0)).toEqual(0x2800);
    expect(cellToUnicode([])).toEqual(BRAILLE_SPACE);
  });

  test("cellToUnicode", () => {
    expect(BRAILLE_SPACE).not.toStrictEqual(" ");
    expect(BRAILLE_SPACE.charCodeAt(0)).toEqual(0x2800);
    expect(cellToUnicode([])).toEqual(BRAILLE_SPACE);
  });

  test("getNumberCharacter", () => {
    expect(getNumberCharacter("1")).toStrictEqual("a");
    expect(getNumberCharacter("8")).toStrictEqual("h");
    expect(getNumberCharacter("0")).toStrictEqual("j");

    expect(getNumberCharacter("a")).toStrictEqual(null);
    expect(getNumberCharacter("")).toStrictEqual(null);
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
      expect(latinStringToCells("")).toEqual([]);
    });

    test("space", () => {
      expect(latinStringToCells(" ")).toEqual([[]]);
    });

    test("lowercase letters", () => {
      expect(latinStringToCells("a")).toEqual([[1]]);
      expect(latinStringToCells("abc")).toEqual([[1], [1, 2], [1, 4]]);
      expect(latinStringToCells("a b c")).toEqual([
        [1],
        [],
        [1, 2],
        [],
        [1, 4],
      ]);
    });

    test("uppercase letters", () => {
      expect(latinStringToCells("A")).toEqual([[6], [1]]);
      expect(latinStringToCells("ABC")).toEqual([
        [6],
        [6],
        [1],
        [1, 2],
        [1, 4],
      ]);
      expect(latinStringToCells("A B C")).toEqual([
        [6],
        [1],
        [],
        [6],
        [1, 2],
        [],
        [6],
        [1, 4],
      ]);

      expect(latinStringToCells("AB")).toEqual([[6], [1], [6], [1, 2]]);

      expect(latinStringToCells("ABC DEF")).toEqual([
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
      expect(latinStringToCells("1")).toEqual([[3, 4, 5, 6], [1]]);
      expect(latinStringToCells("123")).toEqual([
        [3, 4, 5, 6],
        [1],
        [1, 2],
        [1, 4],
      ]);
      expect(latinStringToCells("1 2 3")).toEqual([
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
      expect(latinStringToCells("abc123DEF")).toEqual([
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
    expect(getWordSign("do")).toEqual({
      cell: [1, 4, 5],
      length: 2,
    });
    expect(getWordSign("do not")).toEqual({
      cell: [1, 4, 5],
      length: 2,
    });
    expect(getWordSign("dont")).toBeNull();
  });
});
