import type { Cell } from "./cell";

export const UPPER_CASE_LETTER: Cell = [6];
export const UPPER_CASE_WORD: [Cell, Cell] = [
  UPPER_CASE_LETTER,
  UPPER_CASE_LETTER,
];
export const CAPITALS_TERMINATOR: [Cell, Cell] = [[6], [3]];
export const NUMBER: Cell = [3, 4, 5, 6];
export const LETTER_SIGN: Cell = [5, 6];
