import {
  getKeyByValue,
  filterNullish,
  uppercaseFirstLetter,
  isUppercase,
} from "../utils";

describe("utils", () => {
  test("getKeyByValue with value", () => {
    expect(getKeyByValue({}, 1)).toBeNull();
    expect(getKeyByValue({ a: 1 }, 2)).toBeNull();
    expect(getKeyByValue({ a: 1 }, 1)).toBe("a");
  });

  test("getKeyByValue with function", () => {
    expect(
      getKeyByValue({}, (_: never) => {
        throw Error("should never be called");
      })
    ).toBeNull();
    expect(getKeyByValue({ a: 1 }, (_) => true)).toBe("a");
    expect(
      getKeyByValue(
        { a: 1, b: 3, c: 5, d: 4, e: 5, f: 7 },
        (value) => value % 2 == 0
      )
    ).toBe("d");
  });

  test("filterNullish", () => {
    expect(filterNullish([])).toStrictEqual([]);
    expect(filterNullish([1, 2, "3", "", "null", false])).toStrictEqual([
      1,
      2,
      "3",
      "",
      "null",
      false,
    ]);
    expect(filterNullish([1, undefined, 2, null])).toStrictEqual([1, 2]);
    expect(filterNullish([null, undefined, null, undefined])).toStrictEqual([]);
  });

  test("uppercaseFirstLetter", () => {
    expect(uppercaseFirstLetter("abc")).toBe("Abc");
    expect(uppercaseFirstLetter("a")).toBe("A");
    expect(uppercaseFirstLetter("")).toBe("");
    expect(uppercaseFirstLetter("A")).toBe("A");
  });

  test("isUppercase", () => {
    expect(isUppercase("")).toBe(false);
    expect(isUppercase(" ")).toBe(false);
    expect(isUppercase("a")).toBe(false);
    expect(isUppercase("aA")).toBe(false);

    expect(isUppercase("A")).toBe(true);
    expect(isUppercase(" A ")).toBe(true);
    expect(isUppercase("AB")).toBe(true);
  });
});
