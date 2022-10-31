import { Cell } from "../cell";
import { MatchResult, MatchEntry } from "./types";

/** The current "state" during translation. This is important for tracking what may be valid next characters. */
export type State = "number" | "default";

/** Produces a potential next state. */
export type NextState = new () => StateHandler;

/** The list of potential next states */
export type NextStates = readonly NextState[];

/**
 * Attempts to handle translations for a small subset of rules, like just letters, word-groups, numbers, etc.
 */
export interface StateHandler {
  /**
   * If matched successfully, what potential next states are valid.
   *
   * @returns The next valid states.
   */
  nextStates: () => NextStates;

  /**
   * Attempts to convert the text to braille.
   *
   * @param state The current state
   * @param str The full text to convert
   * @param index The index of `str` being converted
   * @returns The result of translation.
   */
  textToBraille: (state: State, str: string, index: number) => MatchResult;

  /**
   * Attempts to convert braille cells to text.
   *
   * @param state The current state
   * @param cells The full set of cells to convert
   * @param index The index of `cells` being converted
   * @returns The result of translation.
   */
  brailleToText: (
    state: State,
    cells: readonly Cell[],
    index: number
  ) => MatchResult;
}

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

  const nextStates = handler.nextStates();
  for (let i = 0; i < nextStates.length; i++) {
    const nextResult = runBrailleToTextStateMachine(
      cells,
      index + resultLen,
      result.state,
      new nextStates[i]()
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

  const nextStates = handler.nextStates();
  for (let i = 0; i < nextStates.length; i++) {
    const nextResult = runTextToBrailleStateMachine(
      str,
      index + resultLen,
      result.state,
      new nextStates[i]()
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
