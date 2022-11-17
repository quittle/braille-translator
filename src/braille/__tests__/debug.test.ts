import { STATE_DEBUG } from "../state/debug";

describe("debug", () => {
  test("debug is turned off before landing", () => {
    expect(STATE_DEBUG).toBe(false);
  });
});
