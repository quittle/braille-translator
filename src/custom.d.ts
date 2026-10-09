declare module "*.svg" {
  import * as React from "react";

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;

  const src: string;
  export default src;
}

declare module "*.scss";

declare module "hypher" {
  /** Hyphenation engine. */
  export default class Hypher {
    constructor(patterns: Record<string, unknown>);
    /** Breaks the given word into its syllabic parts. */
    hyphenate(word: string): string[];
  }
}

declare module "hyphenation.en-us" {
  const patterns: Record<string, unknown>;
  export default patterns;
}
