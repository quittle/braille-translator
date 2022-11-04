import { getKeyByValue } from "../../utils";
import { NUMBER_LETTER_MAPPING, BRAILLE_MAP } from "../braille-map";
import { NUMBER } from "../braille-modifiers";
import { Cell, cellsEqual } from "../cell";
import { LetterState } from "./letter-state";
import { NextStates, State, StateHandler } from "./state-machine";
import { MatchResult, MatchEntries } from "./types";

/**
 * Matches numbers
 */
export class NumberState implements StateHandler {
  nextStates = (): NextStates => [LetterState, NumberState];

  textToBraille = (state: State, str: string, index: number): MatchResult => {
    const char = str.charAt(index);
    const ret: MatchEntries = [];
    switch (state) {
      case "default":
        ret.push({ str: "", cells: [NUMBER] });
    }
    const letter = NUMBER_LETTER_MAPPING[char];
    if (letter == null) {
      return null;
    }
    ret.push({ str: char, cells: [BRAILLE_MAP[letter]] });
    return { entries: ret, state: "number" };
  };

  brailleToText = (
    state: State,
    cells: readonly Cell[],
    index: number
  ): MatchResult => {
    const cell = cells[index];
    switch (state) {
      case "number": {
        const letter = getKeyByValue(BRAILLE_MAP, (entryCell) =>
          cellsEqual(cell, entryCell)
        );
        if (letter === null) {
          return null;
        }

        const number = getKeyByValue(NUMBER_LETTER_MAPPING, letter);
        if (number === null) {
          return null;
        }

        return {
          entries: [{ str: number, cells: [cell] }],
          state: "number",
        };
      }
      case "default": {
        if (cellsEqual(cell, NUMBER)) {
          return { entries: [{ str: "", cells: [cell] }], state: "number" };
        } else {
          return null;
        }
      }
    }
  };
}
