/** Determines if running in a debug state. This must be `false` before checking in. */
export const STATE_DEBUG = false;

/**
 * Prints logs when debugging is enabled.
 * @param consoleLogArgs The same arguments you would pass to `console.debug()`
 */
export function debugLog(...consoleLogArgs: unknown[]) {
  if (STATE_DEBUG) {
    // eslint-disable-next-line no-console
    console.debug(...consoleLogArgs);
  }
}
