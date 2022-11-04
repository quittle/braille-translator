import { getKeyByValue } from "../../utils";
import { BRAILLE_MAP, WORD_BOUNDARY_CHARS } from "../braille-map";
import { LETTER_SIGN } from "../braille-modifiers";
import { Cell, cellsEqual } from "../cell";
import { AnywhereGroupState } from "./anywhere-group-state";
import { NumberState } from "./number-state";
import { NextStates, State, StateHandler } from "./state-machine";
import { MatchResult, MatchEntries } from "./types";
import { WordGroupState } from "./word-group-state";

/**
 * Matches letters
 */
export class LetterState implements StateHandler {
  nextStates = (): NextStates => [
    AnywhereGroupState,
    WordGroupState,
    LetterState,
    NumberState,
  ];

  textToBraille = (state: State, str: string, index: number): MatchResult => {
    const char = str.charAt(index);
    const match = BRAILLE_MAP[char];
    if (match == null) {
      return null;
    }
    const ret: MatchEntries = [];
    if (state === "number" && !WORD_BOUNDARY_CHARS.includes(char)) {
      ret.push({ str: "", cells: [LETTER_SIGN] });
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
        }
        const letter = getKeyByValue(BRAILLE_MAP, (entryCell) =>
          cellsEqual(entryCell, cell)
        );
        if (letter === null) {
          return null;
        }
        if (WORD_BOUNDARY_CHARS.includes(letter)) {
          return {
            entries: [{ str: letter, cells: [cell] }],
            state: "default",
          };
        }
        return null;
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
