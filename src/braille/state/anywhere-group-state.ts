import { uppercaseFirstLetter } from "../../utils";
import { ANYWHERE_LOWER_GROUP_SIGNS } from "../braille-map";
import { Cell, cellsEqual } from "../cell";
import { LetterState } from "./letter-state";
import { NumberState } from "./number-state";
import { NextStates, State, StateHandler } from "./state-machine";
import { MatchResult } from "./types";
import { WordGroupState } from "./word-group-state";

/**
 * Matches letters
 */
export class AnywhereGroupState implements StateHandler {
  nextStates = (): NextStates => [
    AnywhereGroupState,
    WordGroupState,
    LetterState,
    NumberState,
  ];

  textToBraille = (state: State, str: string, index: number): MatchResult => {
    for (const [sign, cell] of Object.entries(ANYWHERE_LOWER_GROUP_SIGNS)) {
      let actualSign: string;
      switch (state) {
        case State.Default:
        case State.Number:
          actualSign = sign;
          break;
        case State.UppercaseLetter:
          actualSign = uppercaseFirstLetter(sign);
          break;
        case State.UppercaseWord:
          actualSign = sign.toUpperCase();
          break;
      }
      if (str.substring(index, index + sign.length) === actualSign) {
        return {
          entries: [{ str: actualSign, cells: [cell] }],
          state: State.Default,
        };
      }
    }
    return null;
  };

  brailleToText = (
    _state: State,
    cells: readonly Cell[],
    index: number
  ): MatchResult => {
    for (const [sign, cell] of Object.entries(ANYWHERE_LOWER_GROUP_SIGNS)) {
      if (cellsEqual(cells[index], cell)) {
        return {
          entries: [{ str: sign, cells: [cell] }],
          state: State.Default,
        };
      }
    }
    return null;
  };
}
