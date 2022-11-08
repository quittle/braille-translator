import { isUppercase } from "../../utils";
import { UPPER_CASE_LETTER, UPPER_CASE_WORD } from "../braille-modifiers";
import { Cell, cellsEqual } from "../cell";
import { AnywhereGroupState } from "./anywhere-group-state";
import { LetterState } from "./letter-state";
import { NextStates, State, StateHandler } from "./state-machine";
import { MatchResult } from "./types";
import { WordGroupState } from "./word-group-state";

/**
 * Matches uppercase converters
 */
export class UppercaseState implements StateHandler {
  nextStates = (): NextStates => [
    AnywhereGroupState,
    WordGroupState,
    LetterState,
  ];

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
    UPPER_CASE_LETTER;
    const cell = cells[index];

    if (!cellsEqual(cell, UPPER_CASE_LETTER)) {
      return null;
    }

    if (index + 1 < cells.length) {
      const nextCell = cells[index + 1];
      if (cellsEqual(nextCell, UPPER_CASE_LETTER)) {
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
}
