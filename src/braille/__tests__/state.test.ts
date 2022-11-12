/* eslint-disable jest/expect-expect */

import { Cell, INVALID_CELL } from "../cell";
import { brailleToText, textToBraille } from "../state";

/** Tests converting text to braille */
function testTextToBraille(
  text: string,
  expectedOutput: readonly [string, readonly Cell[]][]
) {
  const result = textToBraille(text);
  expect(result).not.toBeNull();

  const textToBrailleOutput = result?.map(({ str, cells }) => [str, cells]);
  expect(textToBrailleOutput).toStrictEqual(expectedOutput);
}

/** Tests converting braille to text */
function testBrailleToText(
  cells: readonly Cell[],
  expectedOutput: readonly [string, readonly Cell[]][]
) {
  const result = brailleToText(cells);
  expect(result).not.toBeNull();

  const brailleToTextOutput = result?.map(({ str, cells }) => [str, cells]);
  expect(brailleToTextOutput).toStrictEqual(expectedOutput);
}

describe("state", () => {
  test.each<
    readonly [
      string,
      "text" | "cells",
      readonly [string, readonly Cell[]][],
      readonly [string, readonly Cell[]][]
    ]
  >([
    [
      "not invalid",
      "text",
      [
        ["a", [[1]]],
        ["b", [[1, 2]]],
        ["c", [[1, 4]]],
      ],
      [
        ["a", [[1]]],
        ["b", [[1, 2]]],
        ["c", [[1, 4]]],
      ],
    ],
    ["simple", "text", [["+", [INVALID_CELL]]], [["?", [INVALID_CELL]]]],
    [
      "prefix and suffix",
      "text",
      [
        ["n", [[1, 3, 4, 5]]],
        ["+", [INVALID_CELL]],
        ["z", [[1, 3, 5, 6]]],
      ],
      [
        ["n", [[1, 3, 4, 5]]],
        ["?", [INVALID_CELL]],
        ["z", [[1, 3, 5, 6]]],
      ],
    ],
    [
      "invalid cell",
      "cells",
      [["?", [[1, 2, 3, 5, 6]]]],
      [["?", [INVALID_CELL]]],
    ],
    [
      "invalid cell prefix and suffix",
      "cells",
      [
        ["a", [[1]]],
        ["?", [[1, 2, 3, 5, 6]]],
        ["z", [[1, 3, 5, 6]]],
      ],
      [
        ["a", [[1]]],
        ["?", [INVALID_CELL]],
        ["z", [[1, 3, 5, 6]]],
      ],
    ],
  ])(
    "partial text: %s",
    (
      _name: string,
      textOrCells: "text" | "cells",
      firstConversion: readonly [string, readonly Cell[]][],
      secondConversion: readonly [string, readonly Cell[]][]
    ) => {
      const [origText, outputCells]: [string, readonly Cell[]] =
        firstConversion.reduce(
          ([prevText, prevCells], [text, cells]) => [
            prevText + text,
            prevCells.concat(cells),
          ],
          ["", []]
        );

      switch (textOrCells) {
        case "text":
          testTextToBraille(origText, firstConversion);
          testBrailleToText(outputCells, secondConversion);
          return;
        case "cells":
          testBrailleToText(outputCells, firstConversion);
          testTextToBraille(origText, secondConversion);
          return;
      }
    }
  );

  test.each<[string, ...[string, readonly Cell[]][]]>([
    ["blank"],
    ["a", ["a", [[1]]]],
    ["space", [" ", [[]]]],
    ["abc", ["a", [[1]]], ["b", [[1, 2]]], ["c", [[1, 4]]]],
    ["3", ["", [[3, 4, 5, 6]]], ["3", [[1, 4]]]],
    [
      "357",
      ["", [[3, 4, 5, 6]]],
      ["3", [[1, 4]]],
      ["5", [[1, 5]]],
      ["7", [[1, 2, 4, 5]]],
    ],
    ["3a", ["", [[3, 4, 5, 6]]], ["3", [[1, 4]]], ["", [[5, 6]]], ["a", [[1]]]],
    ["3 a", ["", [[3, 4, 5, 6]]], ["3", [[1, 4]]], [" ", [[]]], ["a", [[1]]]],
    ["but", ["but", [[1, 2]]]],
    ["but quite", ["but", [[1, 2]]], [" ", [[]]], ["quite", [[1, 2, 3, 4, 5]]]],
    [
      "bo quite",
      ["b", [[1, 2]]],
      ["o", [[1, 3, 5]]],
      [" ", [[]]],
      ["quite", [[1, 2, 3, 4, 5]]],
    ],
    ["en", ["en", [[2, 6]]]],
    ["inin", ["in", [[3, 5]]], ["in", [[3, 5]]]],
    ["then", ["t", [[2, 3, 4, 5]]], ["h", [[1, 2, 5]]], ["en", [[2, 6]]]],
    ["ba", ["b", [[1, 2]]], ["a", [[1]]]],
    ["but-as", ["but", [Cell(1, 2)]], ["-", [[3, 6]]], ["as", [[1, 3, 5, 6]]]],
    [
      "ab-yz",
      ["a", [[1]]],
      ["b", [[1, 2]]],
      ["-", [[3, 6]]],
      ["y", [[1, 3, 4, 5, 6]]],
      ["z", [[1, 3, 5, 6]]],
    ],
    [
      "12in",
      ["", [[3, 4, 5, 6]]],
      ["1", [[1]]],
      ["2", [[1, 2]]],
      ["in", [[3, 5]]],
    ],
    [
      "4 8 0",
      ["", [[3, 4, 5, 6]]],
      ["4", [[1, 4, 5]]],
      [" ", [[]]],
      ["", [[3, 4, 5, 6]]],
      ["8", [[1, 2, 5]]],
      [" ", [[]]],
      ["", [[3, 4, 5, 6]]],
      ["0", [[2, 4, 5]]],
    ],
    ["A", ["", [[6]]], ["A", [[1]]]],
    ["MN", ["", [[6], [6]]], ["M", [[1, 3, 4]]], ["N", [[1, 3, 4, 5]]]],
    [
      "More Not",
      ["", [[6]]],
      ["More", [[1, 3, 4]]],
      [" ", [[]]],
      ["", [[6]]],
      ["Not", [[1, 3, 4, 5]]],
    ],
    [
      "More No",
      ["", [[6]]],
      ["More", [[1, 3, 4]]],
      [" ", [[]]],
      ["", [[6]]],
      ["N", [[1, 3, 4, 5]]],
      ["o", [[1, 3, 5]]],
    ],
    [
      "1 Mn",
      ["l", [[1, 2, 3]]],
      ["", [[6]]],
      ["M", [[1, 3, 4]]],
      ["n", [[1, 3, 4, 5]]],
    ],
    [
      "4B",
      ["", [[3, 4, 5, 6]]],
      ["4", [[1, 4, 5]]],
      ["", [[6]]],
      ["B", [[1, 2]]],
    ],
    [
      "4aB",
      ["", [[3, 4, 5, 6]]],
      ["4", [[1, 4, 5]]],
      ["", [[5, 6]]],
      ["a", [[1]]],
      ["", [[6]]],
      ["B", [[1, 2]]],
    ],
    [
      "abc123ABC",
      // letters
      ["a", [[1]]],
      ["b", [[1, 2]]],
      ["c", [[1, 4]]],
      // numbers
      ["", [[3, 4, 5, 6]]],
      ["1", [[1]]],
      ["2", [[1, 2]]],
      ["3", [[1, 4]]],
      // capitals - no letter sign needed because of capitalization
      ["", [[6], [6]]],
      ["A", [[1]]],
      ["B", [[1, 2]]],
      ["C", [[1, 4]]],
    ],
    [
      "abCD",
      ["a", [[1]]],
      ["b", [[1, 2]]],
      ["", [[6], [6]]],
      ["C", [[1, 4]]],
      ["D", [[1, 4, 5]]],
    ],
    ["Can", ["", [[6]]], ["Can", [[1, 4]]]],
    ["KNOWLEDGE", ["", [[6], [6]]], ["KNOWLEDGE", [[1, 3]]]],
  ])(
    "end-to-end: %s",
    (_name: string, ...input: readonly [string, readonly Cell[]][]) => {
      const [inputText, inputCells]: [string, readonly Cell[]] = input.reduce(
        ([prevText, prevCells], [text, cells]) => [
          prevText + text,
          prevCells.concat(cells),
        ],
        ["", []]
      );

      testTextToBraille(inputText, input);
      testBrailleToText(inputCells, input);
    }
  );
});
