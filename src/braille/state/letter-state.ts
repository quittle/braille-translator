import { getKeyByValue } from "../../utils";
import { BRAILLE_MAP, WORD_BOUNDARY_CHARS } from "../braille-map";
import { LETTER_SIGN } from "../braille-modifiers";
import { Cell, cellsEqual } from "../cell";
import { State, StateHandler } from "./state-handler";
import { MatchResult, MatchEntries } from "./types";

/**
 * Matches letters
 *
 * TODO: Support <space><letter-sign><letter><space>
 */
export class LetterState implements StateHandler {
  textToBraille = (state: State, str: string, index: number): MatchResult => {
    let char = str.charAt(index);
    let isUppercase: boolean;
    switch (state) {
      case State.Default:
      case State.Number:
        isUppercase = false;
        break;
      case State.UppercaseWord:
      case State.UppercaseLetter:
        char = char.toLowerCase();
        isUppercase = true;
        break;
    }
    const match = BRAILLE_MAP[char];
    if (match == null) {
      return null;
    }
    const ret: MatchEntries = [];
    if (state === State.Number && !WORD_BOUNDARY_CHARS.includes(char)) {
      ret.push({ str: "", cells: [LETTER_SIGN] });
    }
    ret.push({ str: isUppercase ? char.toUpperCase() : char, cells: [match] });
    const nextState =
      state === State.UppercaseWord && char !== " "
        ? State.UppercaseWord
        : State.Default;
    return { entries: ret, state: nextState };
  };

  brailleToText = (
    state: State,
    cells: readonly Cell[],
    index: number
  ): MatchResult => {
    const cell = cells[index];
    switch (state) {
      case State.Number: {
        if (cellsEqual(cell, LETTER_SIGN)) {
          return {
            entries: [{ str: "", cells: [cell] }],
            state: State.Default,
          };
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
            state: State.Default,
          };
        }
        return null;
      }
      case State.Default: {
        const letter = getKeyByValue(BRAILLE_MAP, (entryCell) =>
          cellsEqual(cell, entryCell)
        );
        if (letter !== null) {
          return {
            entries: [{ str: letter, cells: [cell] }],
            state: State.Default,
          };
        } else {
          return null;
        }
      }
      case State.UppercaseLetter: {
        const letter = getKeyByValue(BRAILLE_MAP, (entryCell) =>
          cellsEqual(cell, entryCell)
        );
        if (letter !== null) {
          return {
            entries: [{ str: letter.toUpperCase(), cells: [cell] }],
            state: State.Default,
          };
        } else {
          return null;
        }
      }
      case State.UppercaseWord: {
        const letter = getKeyByValue(BRAILLE_MAP, (entryCell) =>
          cellsEqual(cell, entryCell)
        );
        if (letter !== null) {
          return {
            entries: [{ str: letter.toUpperCase(), cells: [cell] }],
            state: State.UppercaseWord,
          };
        } else {
          return null;
        }
      }
    }
  };
}
