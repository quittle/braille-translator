import { Cell } from "../cell";
import { AnywhereGroupState } from "./anywhere-group-state";
import { LetterState } from "./letter-state";
import { NumberState } from "./number-state";
import { State, StateHandler } from "./state-handler";
import { MatchResult, MatchEntry } from "./types";
import { UppercaseState } from "./uppercase-state";
import { WordGroupState } from "./word-group-state";

const ORDERED_STATES: readonly StateHandler[] = [
  new UppercaseState(),
  new AnywhereGroupState(),
  new WordGroupState(),
  new LetterState(),
  new NumberState(),
];

/**
 * Recursively invokes translation of braille cells to text.
 */
export function runBrailleToTextStateMachine(
  cells: readonly Cell[],
  index: number,
  state: State,
  handler: StateHandler
): MatchResult {
  const result = handler.brailleToText(state, cells, index);
  if (result === null) {
    return null;
  }

  const resultLen: number = result.entries.reduce(
    (count, entry: MatchEntry) => count + entry.cells.length,
    0
  );

  if (index + resultLen === cells.length) {
    return result;
  }

  for (let i = 0; i < ORDERED_STATES.length; i++) {
    const nextResult = runBrailleToTextStateMachine(
      cells,
      index + resultLen,
      result.state,
      ORDERED_STATES[i]
    );
    if (nextResult === null) {
      continue;
    }
    return {
      entries: result.entries.concat(nextResult.entries),
      state: nextResult.state,
    };
  }

  return null;
}

/**
 * Recursively invokes translation of text to braille cells.
 */
export function runTextToBrailleStateMachine(
  str: string,
  index: number,
  state: State,
  handler: StateHandler
): MatchResult {
  const result = handler.textToBraille(state, str, index);
  if (result === null) {
    return null;
  }

  const resultLen: number = result.entries.reduce(
    (count, entry: MatchEntry) => count + entry.str.length,
    0
  );

  if (index + resultLen === str.length) {
    return result;
  }

  for (let i = 0; i < ORDERED_STATES.length; i++) {
    const nextResult = runTextToBrailleStateMachine(
      str,
      index + resultLen,
      result.state,
      ORDERED_STATES[i]
    );
    if (nextResult === null) {
      continue;
    }
    return {
      entries: result.entries.concat(nextResult.entries),
      state: nextResult.state,
    };
  }

  return null;
}
