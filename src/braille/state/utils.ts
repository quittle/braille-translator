import breakIntoSyllables from "../../breakIntoSyllables";
import { WORD_BOUNDARY_CELLS, WORD_BOUNDARY_CHARS } from "../braille-map";
import { UPPER_CASE_LETTER } from "../braille-modifiers";
import { Cell, cellsEqual } from "../cell";

/**
 * Checks if the given character range in the string crosses a word boundary
 * @param str The word to check
 * @param start The beginning of the range within `str`
 * @param end The end of the range within `str`
 * @returns `true` if the range does not cross a syllable boundary, otherwise `false`.
 */
export function doesStringSpanCrossSyllableBoundary(
  str: string,
  start: number,
  end: number
): boolean {
  const syllables = breakIntoSyllables(str);
  let count = 0;
  for (const syllable of syllables) {
    const isStartWithinRange =
      start >= count && start < count + syllable.length;
    const isEndWithinSyllable = end >= count && end <= count + syllable.length;
    if (isStartWithinRange) {
      return !isEndWithinSyllable;
    }
    count += syllable.length;
  }
  return false;
}

/**
 * Checks if the current character is valid for being at a word boundary.
 */
export function isStringIndexEligibleForWordBoundary(
  str: string,
  index: number
): boolean {
  if (index !== 0 && !WORD_BOUNDARY_CHARS.includes(str[index - 1])) {
    return false;
  }
  return true;
}

/**
 * Checks if the current cell is valid for being at a word boundary.
 */
export function isCellIndexEligibleForWordBoundary(
  cells: readonly Cell[],
  index: number
): boolean {
  const isBeforeEligible = (index: number): boolean => {
    if (index === 0) {
      return true;
    } else if (
      WORD_BOUNDARY_CELLS.some((cell) => cellsEqual(cell, cells[index - 1]))
    ) {
      return true;
    } else if (cellsEqual(cells[index - 1], UPPER_CASE_LETTER)) {
      return isBeforeEligible(index - 1);
    }
    return false;
  };

  const isAfterEligible = (index: number): boolean => {
    if (index === cells.length - 1) {
      return true;
    } else if (
      WORD_BOUNDARY_CELLS.some((cell) => cellsEqual(cell, cells[index + 1]))
    ) {
      return true;
    } else if (cellsEqual(cells[index], UPPER_CASE_LETTER)) {
      return isAfterEligible(index + 1);
    }
    return false;
  };

  return isBeforeEligible(index) && isAfterEligible(index);
}
