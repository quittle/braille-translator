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

          const output = result?.map(({ str, cells }) => [str, cells]);
          expect(output).toStrictEqual(input);
        }

        {
          const result = brailleToText(inputCells);
          expect(result).not.toBeNull();

          const output = result?.map(({ str, cells }) => [str, cells]);
          expect(output).toStrictEqual(input);
        }
      }
    );
  });
});
