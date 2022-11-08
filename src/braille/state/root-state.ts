import { Cell } from "../cell";
import { State, StateHandler } from "./state-handler";
import { MatchResult } from "./types";

/**
 * Default/Root state. Use this as the entry point for translation.
 */
export class RootState implements StateHandler {
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
