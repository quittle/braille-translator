import { getKeyByValue } from "../../utils";
import { NUMBER_LETTER_MAPPING, BRAILLE_MAP } from "../braille-map";
import { NUMBER } from "../braille-modifiers";
import { Cell, cellsEqual } from "../cell";
import { AnywhereGroupState } from "./anywhere-group-state";
import { LetterState } from "./letter-state";
import { NextStates, State, StateHandler } from "./state-machine";
import { MatchResult, MatchEntries } from "./types";

/**
 * Matches numbers
 */
export class NumberState implements StateHandler {
  nextStates = (): NextStates => [AnywhereGroupState, LetterState, NumberState];

  textToBraille = (state: State, str: string, index: number): MatchResult => {
    const char = str.charAt(index);
    const ret: MatchEntries = [];
    switch (state) {
      case State.Default:
        ret.push({ str: "", cells: [NUMBER] });
    }
    const letter = NUMBER_LETTER_MAPPING[char];
    if (letter == null) {
      return null;
    }
    ret.push({ str: char, cells: [BRAILLE_MAP[letter]] });
    return { entries: ret, state: State.Number };
  };

  brailleToText = (
    state: State,
    cells: readonly Cell[],
    index: number
  ): MatchResult => {
    const cell = cells[index];
    switch (state) {
      case State.Number: {
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
          state: State.Number,
        };
      }
      case State.Default: {
        if (cellsEqual(cell, NUMBER)) {
          return { entries: [{ str: "", cells: [cell] }], state: State.Number };
        } else {
          return null;
        }
      }
    }
  };
}