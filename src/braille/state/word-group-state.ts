import {
  BRAILLE_WORD_SIGNS,
  WORD_BOUNDARY_CELLS,
  WORD_BOUNDARY_CHARS,
} from "../braille-map";
import { Cell, cellsEqual } from "../cell";
import { LetterState } from "./letter-state";
import { NextStates, State, StateHandler } from "./state-machine";
import { MatchResult } from "./types";

/**
 * Checks if the current character is valid for being at a word boundary.
 */
function isStringIndexEligibleForWordBoundary(
  str: string,
  index: number
): boolean {
  if (index !== 0 && !WORD_BOUNDARY_CHARS.includes(str[index - 1])) {
    return false;
  }
  return true;
}

/**
 * Checks if the current cell is valid for being at a word boundary.
 */
function isCellIndexEligibleForWordBoundary(
  cells: readonly Cell[],
  index: number
): boolean {
  if (
    index !== 0 &&
    !WORD_BOUNDARY_CELLS.some((cell) => cellsEqual(cell, cells[index - 1]))
  ) {
    return false;
  }
  if (
    index !== cells.length - 1 &&
    !WORD_BOUNDARY_CELLS.some((cell) => cellsEqual(cell, cells[index + 1]))
  ) {
    return false;
  }
  return true;
}

/**
 * Matches words
 */
export class WordGroupState implements StateHandler {
  nextStates = (): NextStates => [LetterState];

  textToBraille = (state: State, str: string, index: number): MatchResult => {
    switch (state) {
      case "number":
        return null;
      case "default": {
        if (!isStringIndexEligibleForWordBoundary(str, index)) {
          return null;
        }

        for (const [word, cell] of Object.entries(BRAILLE_WORD_SIGNS)) {
          if (word !== str.substring(index, index + word.length)) {
            continue;
          }
          if (
            index + word.length < str.length &&
            !WORD_BOUNDARY_CHARS.includes(str[index + word.length])
          ) {
            continue;
          }
          return {
            entries: [{ str: word, cells: [cell] }],
            state: "default",
          };
        }
        return null;
      }
    }
  };

  brailleToText = (
    state: State,
    cells: readonly Cell[],
    index: number
  ): MatchResult => {
    const cell = cells[index];
    switch (state) {
      case "number":
        return null;
      case "default": {
        if (!isCellIndexEligibleForWordBoundary(cells, index)) {
          return null;
        }

        for (const [word, wordCell] of Object.entries(BRAILLE_WORD_SIGNS)) {
          if (cellsEqual(cell, wordCell)) {
            return {
              entries: [{ str: word, cells: [cell] }],
              state: "default",
            };
          }
        }
        return null;
      }
    }
  };
}
