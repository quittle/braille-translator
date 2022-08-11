import { Cell, cellToUnicode } from "./braille";
import "./braille-character.css";

/**
 * A single braille character being displayed
 */
export default function BrailleCharacter(props: { cell: Cell }) {
  return <span>{cellToUnicode(props.cell)}</span>;
}
