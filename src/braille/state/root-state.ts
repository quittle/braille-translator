import { Cell } from "../cell";
import { AnywhereGroupState } from "./anywhere-group-state";
import { LetterState } from "./letter-state";
import { NumberState } from "./number-state";
import { NextStates, State, StateHandler } from "./state-machine";
import { MatchResult } from "./types";
import { UppercaseState } from "./uppercase-state";
import { WordGroupState } from "./word-group-state";

/**
 * Default/Root state. Use this as the entry point for translation.
 */
export class RootState implements StateHandler {
  nextStates = (): NextStates => [
    UppercaseState,
    AnywhereGroupState,
    WordGroupState,
    LetterState,
    NumberState,
  ];

  textToBraille = (
    _state: State,
    _str: string,
    _index: number
  ): MatchResult => {
    // Empty match to kick things off
    return { entries: [], state: State.Default };
  };

  brailleToText = (
    _state: State,
    _cells: readonly Cell[],
    _index: number
  ): MatchResult => {
    // Empty match to kick things off
    return { entries: [], state: State.Default };
  };
}
