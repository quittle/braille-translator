import { Cell } from "../cell";
import { RootState } from "./root-state";
import {
  runBrailleToTextStateMachine,
  runTextToBrailleStateMachine,
  State,
} from "./state-machine";
import { MatchEntries } from "./types";
export type { MatchEntries, MatchEntry } from "./types";

/**
 * Converts text to braille.
 * @param str The text to convert
 * @returns The result or `null` if invalid.
 */
export function textToBraille(str: string): MatchEntries | null {
  const result = runTextToBrailleStateMachine(
    str,
    0,
    State.Default,
    new RootState()
  );
  if (result === null) {
    return null;
  }
  return result.entries;
}

/**
 * Converts braille cells to text.
 * @param cells The cells to convert
 * @returns The result or `null` if invalid.
 */
export function brailleToText(cells: readonly Cell[]): MatchEntries | null {
  const result = runBrailleToTextStateMachine(
    cells,
    0,
    State.Default,
    new RootState()
  );
  if (result === null) {
    return null;
  }
  return result.entries;
}
