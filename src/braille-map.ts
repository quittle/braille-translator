import type { Cell } from "./braille";

export namespace BrailleModifiers {
  export const UPPER_CASE_LETTER: Cell = [6];
  export const UPPER_CASE_WORD: [Cell, Cell] = [
    UPPER_CASE_LETTER,
    UPPER_CASE_LETTER,
  ];
  export const NUMBER: Cell = [3, 4, 5, 6];
  export const LETTER_SIGN: Cell = [5, 6];
}

/** A mapping of latin characers to braille cells */
export const BRAILLE_MAP: Readonly<{ [latinCharacter: string]: Cell }> = {
  a: [1],
  b: [1, 2],
  c: [1, 4],
  d: [1, 4, 5],
  e: [1, 5],
  f: [1, 2, 4],
  g: [1, 2, 4, 5],
  h: [1, 2, 5],
  i: [2, 4],
  j: [2, 4, 5],
  k: [1, 3],
  l: [1, 2, 3],
  m: [1, 3, 4],
  n: [1, 3, 4, 5],
  o: [1, 3, 5],
  p: [1, 2, 3, 4],
  q: [1, 2, 3, 4, 5],
  r: [1, 2, 3, 5],
  s: [2, 3, 4],
  t: [2, 3, 4, 5],
  u: [1, 3, 6],
  v: [1, 2, 3, 6],
  w: [2, 4, 5, 6],
  x: [1, 3, 4, 6],
  y: [1, 3, 4, 5, 6],
  z: [1, 3, 5, 6],
  " ": [],
};
