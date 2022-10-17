import type { ValidCell } from "./cell";

export const WORD_BOUNDARY_CHARS: readonly string[] = ["-", " "];

export type LatinToCellMapping = Readonly<{
  [latinCharacter: string]: ValidCell;
}>;

/** A mapping of latin characers to braille cells */
export const BRAILLE_MAP: LatinToCellMapping = {
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
  "-": [3, 6],
};

/** A mapping of words to single-letter signs */
export const BRAILLE_WORD_SIGNS: LatinToCellMapping = {
  // No a
  but: BRAILLE_MAP["b"],
  can: BRAILLE_MAP["c"],
  do: BRAILLE_MAP["d"],
  every: BRAILLE_MAP["e"],
  from: BRAILLE_MAP["f"],
  go: BRAILLE_MAP["g"],
  have: BRAILLE_MAP["h"],
  // No i
  just: BRAILLE_MAP["j"],
  knowledge: BRAILLE_MAP["k"],
  like: BRAILLE_MAP["l"],
  more: BRAILLE_MAP["m"],
  not: BRAILLE_MAP["n"],
  // No o
  people: BRAILLE_MAP["p"],
  quite: BRAILLE_MAP["q"],
  rather: BRAILLE_MAP["r"],
  so: BRAILLE_MAP["s"],
  that: BRAILLE_MAP["t"],
  us: BRAILLE_MAP["u"],
  very: BRAILLE_MAP["v"],
  will: BRAILLE_MAP["w"],
  it: BRAILLE_MAP["x"],
  you: BRAILLE_MAP["y"],
  as: BRAILLE_MAP["z"],
  were: [2, 3, 5, 6],
  still: [3, 4],
  child: [1, 6],
  shall: [1, 4, 6],
  this: [1, 4, 5, 6],
  which: [1, 5, 6],
  out: [1, 2, 5, 6],
  enough: [2, 6],
  his: [2, 3, 6],
  was: [3, 5, 6],
};

export const NUMBER_LETTER_MAPPING: Readonly<{ [number: string]: string }> = {
  "1": "a",
  "2": "b",
  "3": "c",
  "4": "d",
  "5": "e",
  "6": "f",
  "7": "g",
  "8": "h",
  "9": "i",
  "0": "j",
};

export const ANYWHERE_LOWER_GROUP_SIGNS: LatinToCellMapping = {
  en: [2, 6],
  in: [3, 5],
};
