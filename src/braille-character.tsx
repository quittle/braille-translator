import { Cell, cellToUnicode, isValidCell } from "./braille";
import "./braille-character.css";

/**
 * A single braille character being displayed
 */
export default function BrailleCharacter(props: { cell: Cell }) {
  const title = isValidCell(props.cell) ? undefined : "Unknown Character";
  return <span title={title}>{cellToUnicode(props.cell)}</span>;
}
