import { useState } from "react";
import { Cell, cellToUnicode } from "./braille";
import BrailleInput from "./braille-input";
import { ReactComponent as BackspaceIcon } from "./assets/icon-backspace.svg";
import "./braille-to-latin.scss";

/**
 * Section for converting braille to text
 */
export default function BrailleToLatin() {
  const [brailleInput, setBrailleInput] = useState<ReadonlyArray<Cell>>([]);

  const onBackspaceClick = () => {
    setBrailleInput(brailleInput.slice(0, -1));
  };

  return (
    <div className="braille-to-latin">
      <span className="input-wrapper">
        <BrailleInput
          onCharacter={(cell) => setBrailleInput([...brailleInput, cell])}
        />
      </span>
      <span className="braille-output">
        {brailleInput.reduce((text, cell) => text + cellToUnicode(cell), "")}
        {brailleInput.length > 0 && (
          <button onClick={onBackspaceClick}>
            <BackspaceIcon />
          </button>
        )}
      </span>
    </div>
  );
}
