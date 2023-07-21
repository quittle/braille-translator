import { Cell, INVALID_CELL } from "../cell";
import { AnywhereGroupState } from "./anywhere-group-state";
import { debugLog } from "./debug";
import { LetterState } from "./letter-state";
import { NumberState } from "./number-state";
import { RootState } from "./root-state";
import { State, StateHandler } from "./state-handler";
import { StrongGroupSign } from "./strong-group-sign-state";
import { MatchResult, MatchEntry } from "./types";
import { UppercaseState } from "./uppercase-state";
import { WordGroupState } from "./word-group-state";

const ORDERED_STATES: readonly StateHandler[] = [
  new UppercaseState(),
  new WordGroupState(),
  new StrongGroupSign(),
  new AnywhereGroupState(),
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

  debugLog(
    "runBrailleToTextStateMachine matched",
    handler.constructor.name,
    "(",
    cells,
    ")[",
    index,
    "]"
  );

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

  const nextCell = cells[index + resultLen];

  if (index + resultLen + 1 === cells.length) {
    return {
      entries: result.entries.concat([{ str: "?", cells: [nextCell] }]),
      state: result.state,
    };
  }
  const fallbackResult = runBrailleToTextStateMachine(
    cells,
    index + resultLen + 1,
    result.state,
    new RootState()
  );
  if (fallbackResult == null) {
    return {
      entries: result.entries.concat([{ str: "?", cells: [nextCell] }]),
      state: result.state,
    };
  }

  return {
    entries: result.entries.concat(
      [{ str: "?", cells: [nextCell] }],
      fallbackResult.entries
    ),
    state: fallbackResult.state,
  };
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

  const nextChar = str[index + resultLen];
  if (index + resultLen + 1 === str.length) {
    return {
      entries: result.entries.concat([
        { str: nextChar, cells: [INVALID_CELL] },
      ]),
      state: result.state,
    };
  }
  const fallbackResult = runTextToBrailleStateMachine(
    str,
    index + resultLen + 1,
    result.state,
    new RootState()
  );
  if (fallbackResult == null) {
    return {
      entries: result.entries.concat([
        { str: nextChar, cells: [INVALID_CELL] },
      ]),
      state: result.state,
    };
  }

  return {
    entries: result.entries.concat(
      [{ str: nextChar, cells: [INVALID_CELL] }],
      fallbackResult.entries
    ),
    state: fallbackResult.state,
  };
}
