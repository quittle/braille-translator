import {
  ANYWHERE_STRONG_GROUP_SIGNS,
  STRONG_GROUP_SIGNS,
} from "../braille-map";
import { getKeyByValue, uppercaseFirstLetter } from "../../utils";
import { Cell, cellsEqual } from "../cell";
import { State, StateHandler } from "./state-handler";
import { MatchResult } from "./types";
import {
  doesStringSpanCrossSyllableBoundary,
  isStringIndexEligibleForWordBoundary,
} from "./utils";

/**
 * Matches strong group signs. Most are allowed everywhere except
 * - when they bridge the components of a compound word
 * - when the "h" is aspirated.
 * - "ing" cannot be at the beginning of a word
 */
export class StrongGroupSign implements StateHandler {
  textToBraille = (state: State, str: string, index: number): MatchResult => {
    const onlyAnywhereEligible = isStringIndexEligibleForWordBoundary(
      str,
      index
    );
    const words = {
      ...ANYWHERE_STRONG_GROUP_SIGNS,
      ...(onlyAnywhereEligible ? {} : STRONG_GROUP_SIGNS),
    };

    for (const [word, cell] of Object.entries(words)) {
      let modifiedWord: string;
      let nextState: State;
      switch (state) {
        case State.Number:
          // Can't be used in ordinals
          return null;
        case State.Default:
          modifiedWord = word;
          nextState = State.Default;
          break;
        case State.UppercaseLetter:
          modifiedWord = uppercaseFirstLetter(word);
          nextState = State.Default;
          break;
        case State.UppercaseWord:
          modifiedWord = word.toUpperCase();
          nextState = State.UppercaseWord;
      }

      if (modifiedWord !== str.substring(index, index + word.length)) {
        continue;
      }
      if (
        doesStringSpanCrossSyllableBoundary(str, index, index + word.length)
      ) {
        continue;
      }

      return {
        entries: [{ str: modifiedWord, cells: [cell] }],
        state: nextState,
      };
    }
    return null;
  };

  brailleToText = (
    state: State,
    cells: readonly Cell[],
    index: number
  ): MatchResult => {
    const cell = cells[index];

    const words = {
      ...ANYWHERE_STRONG_GROUP_SIGNS,
      ...STRONG_GROUP_SIGNS,
    };

    const match = getKeyByValue(words, (entryCell) =>
      cellsEqual(entryCell, cell)
    );

    if (match === null) {
      return null;
    }

    switch (state) {
      case State.Number:
      case State.Default: {
        return {
          entries: [{ str: match, cells: [cell] }],
          state: State.Default,
        };
      }
      case State.UppercaseLetter: {
        return {
          entries: [{ str: uppercaseFirstLetter(match), cells: [cell] }],
          state: State.Default,
        };
      }
      case State.UppercaseWord: {
        return {
          entries: [{ str: match.toUpperCase(), cells: [cell] }],
          state: State.UppercaseWord,
        };
      }
    }
  };
}
