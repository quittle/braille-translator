import { getKeyByValue, isUppercase } from "../../utils";
import { BRAILLE_MAP, WORD_BOUNDARY_CHARS } from "../braille-map";
import { CAPITALS_TERMINATOR, LETTER_SIGN } from "../braille-modifiers";
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
    const char = str.charAt(index);
    switch (state) {
      case State.Default: {
        const match = BRAILLE_MAP[char];
        if (match == null) {
          return null;
        }
        return {
          entries: [{ str: char, cells: [match] }],
          state: State.Default,
        };
      }
      case State.Number: {
        const match = BRAILLE_MAP[char];
        if (match == null) {
          return null;
        }
        const entries: MatchEntries = [];
        if (!WORD_BOUNDARY_CHARS.includes(char)) {
          entries.push({ str: "", cells: [LETTER_SIGN] });
        }
        entries.push({
          str: char,
          cells: [match],
        });
        return { entries, state: State.Default };
      }
      case State.UppercaseWord: {
        const isUppercaseChar = isUppercase(char);
        const match = BRAILLE_MAP[isUppercaseChar ? char.toLowerCase() : char];
        if (match == null) {
          return null;
        }
        const entries: MatchEntries = [];
        if (!isUppercaseChar) {
          entries.push({ str: "", cells: CAPITALS_TERMINATOR });
        }
        entries.push({ str: char, cells: [match] });
        const nextState = isUppercaseChar ? State.UppercaseWord : State.Default;
        return { entries, state: nextState };
      }
      case State.UppercaseLetter: {
        if (!isUppercase(char)) {
          // This would be a very odd situation and likely a bug.
          return null;
        }

        const match = BRAILLE_MAP[char.toLowerCase()];
        if (match == null) {
          return null;
        }
        return {
          entries: [{ str: char, cells: [match] }],
          state: State.Default,
        };
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
