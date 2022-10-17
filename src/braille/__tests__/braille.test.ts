import {
  cellToUnicode,
  isValidCell,
  latinStringToCells,
  cellsToText,
  Cell,
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

  describe("cellsToText", () => {
    test("empty", () => {
      expect(cellsToText([])).toStrictEqual([]);
    });

    test("simple", () => {
      expect(cellsToText([[1]])).toStrictEqual([["a", [1]]]);
      expect(cellsToText([[]])).toStrictEqual([[" ", []]]);
      expect(cellsToText([[1, 3, 5]])).toStrictEqual([["o", [1, 3, 5]]]);
    });

    test("number", () => {
      expect(cellsToText([[3, 4, 5, 6]])).toStrictEqual([["", [3, 4, 5, 6]]]);
      expect(cellsToText([[3, 4, 5, 6], [1]])).toStrictEqual([
        ["", [3, 4, 5, 6]],
        ["1", [1]],
      ]);
      expect(cellsToText([[3, 4, 5, 6], [1], [1, 2]])).toStrictEqual([
        ["", [3, 4, 5, 6]],
        ["1", [1]],
        ["2", [1, 2]],
      ]);
    });

    test("wordsign", () => {
      expect(cellsToText([[1, 2]])).toStrictEqual([["but", [1, 2]]]);
      expect(cellsToText([[1, 2], [1]])).toStrictEqual([
        ["b", [1, 2]],
        ["a", [1]],
      ]);
      expect(cellsToText([[1, 2], [], [1]])).toStrictEqual([
        ["but", [1, 2]],
        [" ", []],
        ["a", [1]],
      ]);
      expect(cellsToText([[1, 2], [1], [], [1, 4]])).toStrictEqual([
        ["b", [1, 2]],
        ["a", [1]],
        [" ", []],
        ["can", [1, 4]],
      ]);
    });

    test("groupsign", () => {
      expect(cellsToText([[2, 6]])).toStrictEqual([["en", [2, 6]]]);
      expect(cellsToText([[1], [2, 6]])).toStrictEqual([
        ["a", [1]],
        ["en", [2, 6]],
      ]);
      expect(cellsToText([[3, 5], [1]])).toStrictEqual([
        ["in", [3, 5]],
        ["a", [1]],
      ]);
    });
  });

  describe("end-to-end", () => {
    test.each<readonly [string, readonly Cell[]][]>([
      [],
      [["a", [[1]]]],
      [
        ["a", [[1]]],
        ["b", [[1, 2]]],
        ["c", [[1, 4]]],
      ],
      [
        ["", [[3, 4, 5, 6]]],
        ["3", [[1, 4]]],
      ],
      [
        ["", [[3, 4, 5, 6]]],
        ["3", [[1, 4]]],
        ["", [[5, 6]]],
        ["a", [[1]]],
      ],
      [["but", [[1, 2]]]],
      [["en", [[2, 6]]]],
      [
        ["t", [[2, 3, 4, 5]]],
        ["h", [[1, 2, 5]]],
        ["en", [[2, 6]]],
      ],
    ])("basic %j", (...input: readonly [string, readonly Cell[]][]) => {
      const [inputText, inputCells]: [string, readonly Cell[]] = input.reduce(
        (prev, [text, cells]) => [prev[0] + text, prev[1].concat(cells)],
        ["", []]
      );

      {
        const outputCells: Cell[] = latinStringToCells(inputText);
        expect(outputCells).toStrictEqual(inputCells);
      }

      {
        // cellsToText doesn't currently support returning multiple cells per chunk of string.
        const output = cellsToText(inputCells).map(([text, cell]) => [
          text,
          [cell],
        ]);
        expect(output).toStrictEqual(input);
      }
    });
  });
});
