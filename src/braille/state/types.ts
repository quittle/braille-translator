import { Cell } from "../cell";
import { State } from "./state-machine";

/** A single, matched entry */
export type MatchEntry = {
  /** The text for the entry. May contain 0, 1, or multiple characters. */
  str: string;
  /** The cells for the entry. May contain 0, 1, or multiple cells. */
  cells: Cell[];
};

/** An array of entries */
export type MatchEntries = MatchEntry[];

/**
 * The result of attempting to match text or braille during translation. `null` if invalid.
 */
export type MatchResult = {
  /** The array of entries. */
  entries: MatchEntries;
  /** The state after matching. */
  state: State;
} | null;
