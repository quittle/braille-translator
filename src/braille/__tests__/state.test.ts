import { Cell } from "../cell";
import { brailleToText, textToBraille } from "../state";

describe("state", () => {
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
      [
        ["", [[3, 4, 5, 6]]],
        ["3", [[1, 4]]],
        [" ", [[]]],
        ["a", [[1]]],
      ],
      [["but", [[1, 2]]]],
      [["en", [[2, 6]]]],
      [
        ["t", [[2, 3, 4, 5]]],
        ["h", [[1, 2, 5]]],
        ["en", [[2, 6]]],
      ],
      [
        ["b", [[1, 2]]],
        ["a", [[1]]],
      ],
      [
        ["but", [Cell(1, 2)]],
        ["-", [[3, 6]]],
        ["as", [[1, 3, 5, 6]]],
      ],
      [
        ["a", [[1]]],
        ["b", [[1, 2]]],
        ["-", [[3, 6]]],
        ["y", [[1, 3, 4, 5, 6]]],
        ["z", [[1, 3, 5, 6]]],
      ],
      [
        ["", [[3, 4, 5, 6]]],
        ["1", [[1]]],
        ["2", [[1, 2]]],
        ["in", [[3, 5]]],
      ],
    ])(
      "forward-reverse: %j %j %j %j %j %j %j %j %j",
      (...input: readonly [string, readonly Cell[]][]) => {
        const [inputText, inputCells]: [string, readonly Cell[]] = input.reduce(
          ([prevText, prevCells], [text, cells]) => [
            prevText + text,
            prevCells.concat(cells),
          ],
          ["", []]
        );

        {
          const result = textToBraille(inputText);
          expect(result).not.toBeNull();

          const textToBrailleOutput = result?.map(({ str, cells }) => [
            str,
            cells,
          ]);
          expect(textToBrailleOutput).toStrictEqual(input);
        }

        {
          const result = brailleToText(inputCells);
          expect(result).not.toBeNull();

          const brailleToTextOutput = result?.map(({ str, cells }) => [
            str,
            cells,
          ]);
          expect(brailleToTextOutput).toStrictEqual(input);
        }
      }
    );
  });
});
