import { getKeyByValue } from "../../utils";
import { BRAILLE_MAP } from "../braille-map";
import { LETTER_SIGN } from "../braille-modifiers";
import { Cell, cellsEqual } from "../cell";
import { NumberState } from "./number-state";
import { NextStates, State, StateHandler } from "./state-machine";
import { MatchResult, MatchEntries } from "./types";

/**
 * Matches letters
 */
export class LetterState implements StateHandler {
  nextStates = (): NextStates => [LetterState, NumberState];

  textToBraille = (state: State, str: string, index: number): MatchResult => {
    const char = str.charAt(index);
    const ret: MatchEntries = [];
    switch (state) {
      case "number":
        ret.push({ str: "", cells: [LETTER_SIGN] });
    }
    const match = BRAILLE_MAP[char];
    if (match == null) {
      return null;
    }
    ret.push({ str: char, cells: [match] });
    return { entries: ret, state: "default" };
  };

  brailleToText = (
    state: State,
    cells: readonly Cell[],
    index: number
  ): MatchResult => {
    const cell = cells[index];
    switch (state) {
      case "number": {
        if (cellsEqual(cell, LETTER_SIGN)) {
          return { entries: [{ str: "", cells: [cell] }], state: "default" };
        } else {
          return null;
        }
      }
      case "default": {
        const letter = getKeyByValue(BRAILLE_MAP, (entryCell) =>
          cellsEqual(cell, entryCell)
        );
        if (letter !== null) {
          return {
            entries: [{ str: letter, cells: [cell] }],
            state: "default",
          };
        } else {
          return null;
        }
      }
    }
  };
}
