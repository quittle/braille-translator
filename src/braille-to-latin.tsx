import { useState } from "react";
import { Cell, brailleToText, cellToUnicode } from "./braille";
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

  const translatedText = brailleToText(brailleInput) ?? [];

  return (
    <div className="braille-to-latin">
      <span className="input-wrapper">
        <BrailleInput
          onCharacter={(cell) => setBrailleInput([...brailleInput, cell])}
        />
      </span>
      <span className="braille-output-wrapper">
        <table className="braille-output">
          <tbody>
            <tr>
              {translatedText.map(({ cells }, index) => (
                <td key={index}>{cells.map(cellToUnicode).join("")}</td>
              ))}
            </tr>
            <tr>
              {translatedText.map(({ str }, index) => (
                <td key={index}>{str}</td>
              ))}
            </tr>
          </tbody>
        </table>

        {brailleInput.length > 0 && (
          <button onClick={onBackspaceClick}>
            <BackspaceIcon />
          </button>
        )}
      </span>
    </div>
  );
}
