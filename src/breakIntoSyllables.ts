// These are untyped and require to be loaded this way.

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Hypher = require("hypher");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const english = require("hyphenation.en-us");

const hypher = new Hypher(english);

/**
 * Breaks the given word into its syllabic parts
 * @param word The word to break up
 * @returns An array of the syllables of the word
 */
export default function breakIntoSyllables(word: string): string[] {
  return hypher.hyphenate(word);
}
