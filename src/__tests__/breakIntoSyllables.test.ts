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
    expect(breakIntoSyllables("mist")).toStrictEqual(["mist"]);
    expect(breakIntoSyllables("mistake")).toStrictEqual(["mis", "take"]);
  });
});
