import { isUppercase } from "../../utils";
import {
  CAPITALS_TERMINATOR,
  UPPER_CASE_LETTER,
  UPPER_CASE_WORD,
} from "../braille-modifiers";
import { Cell, cellsEqual } from "../cell";
import { State, StateHandler } from "./state-handler";
import { MatchResult } from "./types";

/**
 * Matches uppercase converters
 */
export class UppercaseState implements StateHandler {
  textToBraille = (state: State, str: string, index: number): MatchResult => {
    switch (state) {
      case State.UppercaseLetter:
      case State.UppercaseWord:
        return null;
      case State.Default:
      case State.Number:
        break;
    }

    const char = str.charAt(index);
    if (!isUppercase(char)) {
      return null;
    }

    if (index + 1 < str.length) {
      const nextChar = str.charAt(index + 1);
      if (isUppercase(nextChar)) {
        return {
          entries: [{ str: "", cells: UPPER_CASE_WORD }],
          state: State.UppercaseWord,
        };
      }
    }
    return {
      entries: [{ str: "", cells: [UPPER_CASE_LETTER] }],
      state: State.UppercaseLetter,
    };
  };

  brailleToText = (
    _state: State,
    cells: readonly Cell[],
    index: number
  ): MatchResult => {
    const cell = cells[index];

    if (!cellsEqual(cell, UPPER_CASE_LETTER)) {
      return null;
    }

    if (index + 1 == cells.length) {
      return {
        entries: [{ str: "", cells: [UPPER_CASE_LETTER] }],
        state: State.UppercaseLetter,
      };
    }

    const nextCell = cells[index + 1];
    if (cellsEqual(nextCell, UPPER_CASE_LETTER)) {
      return {
        entries: [{ str: "", cells: UPPER_CASE_WORD }],
        state: State.UppercaseWord,
      };
    } else if (cellsEqual(nextCell, CAPITALS_TERMINATOR[1])) {
      return {
        entries: [
          {
            str: "",
            cells: CAPITALS_TERMINATOR,
          },
        ],
        state: State.Default,
      };
    } else {
      return {
        entries: [{ str: "", cells: [UPPER_CASE_LETTER] }],
        state: State.UppercaseLetter,
      };
    }
  };
}
