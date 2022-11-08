import { Cell } from "../cell";
import { MatchResult } from "./types";

/** The current "state" during translation. This is important for tracking what may be valid next characters. */
export enum State {
  Default,
  Number,
  UppercaseLetter,
  UppercaseWord,
}

/**
 * Attempts to handle translations for a small subset of rules, like just letters, word-groups, numbers, etc.
 */
export interface StateHandler {
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
