import { uppercaseFirstLetter } from "../../utils";
import { BRAILLE_WORD_SIGNS, WORD_BOUNDARY_CHARS } from "../braille-map";
import { Cell, cellsEqual } from "../cell";
import { State, StateHandler } from "./state-handler";
import { MatchResult } from "./types";
import {
  isStringIndexEligibleForWordBoundary,
  isCellIndexEligibleForWordBoundary,
} from "./utils";

/**
 * Matches words
 */
export class WordGroupState implements StateHandler {
  textToBraille = (state: State, str: string, index: number): MatchResult => {
    switch (state) {
      case State.Number:
        return null;
      case State.Default: {
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
            state: State.Default,
          };
        }
      }
      case State.UppercaseWord: {
        if (!isStringIndexEligibleForWordBoundary(str, index)) {
          return null;
        }

        for (const [word, cell] of Object.entries(BRAILLE_WORD_SIGNS)) {
          const uppercaseWord = word.toUpperCase();
          if (uppercaseWord !== str.substring(index, index + word.length)) {
            continue;
          }
          if (
            index + word.length < str.length &&
            !WORD_BOUNDARY_CHARS.includes(str[index + word.length])
          ) {
            continue;
          }
          return {
            entries: [{ str: uppercaseWord, cells: [cell] }],
            state: State.Default,
          };
        }
        return null;
      }
      case State.UppercaseLetter: {
        if (!isStringIndexEligibleForWordBoundary(str, index)) {
          return null;
        }

        for (const [word, cell] of Object.entries(BRAILLE_WORD_SIGNS)) {
          const uppercaseLetter = uppercaseFirstLetter(word);
          if (uppercaseLetter !== str.substring(index, index + word.length)) {
            continue;
          }
          if (
            index + word.length < str.length &&
            !WORD_BOUNDARY_CHARS.includes(str[index + word.length])
          ) {
            continue;
          }
          return {
            entries: [{ str: uppercaseLetter, cells: [cell] }],
            state: State.Default,
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
      case State.Number:
        return null;
      case State.Default: {
        const word = getWordFromCell(cells, index);
        if (word === null) {
          return null;
        }
        return {
          entries: [{ str: word, cells: [cell] }],
          state: State.Default,
        };
      }
      case State.UppercaseLetter: {
        const word = getWordFromCell(cells, index);
        if (word === null) {
          return null;
        }

        return {
          entries: [
            {
              str: uppercaseFirstLetter(word),
              cells: [cell],
            },
          ],
          state: State.Default,
        };
      }
      case State.UppercaseWord: {
        const word = getWordFromCell(cells, index);
        if (word === null) {
          return null;
        }

        return {
          entries: [
            {
              str: word.toUpperCase(),
              cells: [cell],
            },
          ],
          state: State.Default,
        };
      }
    }
  };
}

/** Attempts to get a word sign from the cells. */
function getWordFromCell(cells: readonly Cell[], index: number): string | null {
  const cell = cells[index];
  if (!isCellIndexEligibleForWordBoundary(cells, index)) {
    return null;
  }

  for (const [word, wordCell] of Object.entries(BRAILLE_WORD_SIGNS)) {
    if (cellsEqual(cell, wordCell)) {
      return word;
    }
  }
  return null;
}
