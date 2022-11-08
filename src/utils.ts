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

/**
 * Removes all null-ish values, `null` or `undefined`, from the array, returning a new array.
 * @param arr The array to filter
 * @returns The contents of `arr`, in the same order, minus all the nullish values.
 */
export function filterNullish<T>(arr: readonly (T | undefined | null)[]): T[] {
  return arr.filter((entry) => entry != null) as T[];
}

/**
 * Uppercases the first letter of a string
 * @param str The string to convert the case of
 * @returns The converted string.
 */
export function uppercaseFirstLetter(str: string): string {
  if (str.length === 0) {
    return "";
  }
  return str[0].toUpperCase() + str.substring(1);
}

/**
 * Checks if a string is uppercase. If the string doesn't have a meaningful case, such as " ", returns false.
 */
export function isUppercase(str: string): boolean {
  return str.toUpperCase() === str && str.toLowerCase() !== str;
}
