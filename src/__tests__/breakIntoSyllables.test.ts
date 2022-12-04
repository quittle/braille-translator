import breakIntoSyllables from "../breakIntoSyllables";

describe("breakIntoSyllables", () => {
  test("samples", () => {
    expect(breakIntoSyllables("food")).toStrictEqual(["food"]);
    expect(breakIntoSyllables("hyphenate")).toStrictEqual([
      "hy",
      "phen",
      "ate",
    ]);
    expect(breakIntoSyllables("sample")).toStrictEqual(["sam", "ple"]);
  });
});
