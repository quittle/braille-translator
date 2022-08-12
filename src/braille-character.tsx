import { Cell, cellToUnicode, isValidCell } from "./braille";
import "./braille-character.scss";

/**
 * A single braille character being displayed
 */
export default function BrailleCharacter(props: { cell: Cell }) {
  const isValid = isValidCell(props.cell);
  const title = isValid ? undefined : "Unknown Character";
  return (
    <span
      className={"braille-character " + (isValid ? "" : "invalid")}
      title={title}
    >
      {cellToUnicode(props.cell)}
    </span>
  );
}
