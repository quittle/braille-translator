import { useState } from "react";
import { Cell, cellsToText, cellToUnicode } from "./braille";
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

  const translatedText: ReadonlyArray<[string, Cell]> =
    cellsToText(brailleInput);

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
              {translatedText.map(([_text, cell], index) => (
                <td key={index}>{cellToUnicode(cell)}</td>
              ))}
            </tr>
            <tr>
              {translatedText.map(([text, _cell], index) => (
                <td key={index}>{text}</td>
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
