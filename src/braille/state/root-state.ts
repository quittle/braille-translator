import { Cell } from "../cell";
import { LetterState } from "./letter-state";
import { NumberState } from "./number-state";
import { NextStates, State, StateHandler } from "./state-machine";
import { MatchResult } from "./types";

/**
 *
 */
export class RootState implements StateHandler {
  nextStates = (): NextStates => [LetterState, NumberState];

  textToBraille = (
    _state: State,
    _str: string,
    _index: number
  ): MatchResult => {
    return { entries: [], state: "default" };
  };

  brailleToText = (
    _state: State,
    _cells: readonly Cell[],
    _index: number
  ): MatchResult => {
    return { entries: [], state: "default" };
  };
}
