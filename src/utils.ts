/**
 * Looks up the key of an object by matching against a value.
 * @param haystack The object to search through.
 * @param match If match is a function, invokes it on each value of the object until it returns
 *              `true`. If not a function, a strict equality check against it is performed.
 * @returns The key of the first entry in the object that matches. If no values match, then `null`
 *          is returned.
 */
export function getKeyByValue<T>(
  haystack: Readonly<{ [key: string]: T }>,
  match: ((value: T) => boolean) | T
): string | null {
  const foundEntry = Object.entries(haystack).find(([_key, value]) => {
    if (typeof match === "function") {
      return (match as (value: T) => boolean)(value);
    } else {
      return match === value;
    }
  });

  if (!foundEntry) {
    return null;
  }

  return foundEntry[0];
}
