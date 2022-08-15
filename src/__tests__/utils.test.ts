import { getKeyByValue } from "../utils";

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
});
