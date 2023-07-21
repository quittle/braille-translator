import { doesStringSpanCrossSyllableBoundary } from "../state/utils";

describe("braille state utils", () => {
  test("doesStringSpanCrossSyllableBoundary", () => {
    expect(doesStringSpanCrossSyllableBoundary("mistake", 0, 1)).toBe(false);
    expect(doesStringSpanCrossSyllableBoundary("mistake", 0, 6)).toBe(true);
    expect(doesStringSpanCrossSyllableBoundary("mistake", 2, 3)).toBe(false);
    expect(doesStringSpanCrossSyllableBoundary("mistake", 2, 4)).toBe(true);
    expect(doesStringSpanCrossSyllableBoundary("mistake", 3, 4)).toBe(false);
  });
});
