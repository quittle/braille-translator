import { cellToUnicode, latinStringToCells } from "./braille";
import BrailleCharacter from "./braille-character";
import "./braille-box.scss";
import CopyButton from "./copy-button";

/**
 * Displays braille text
 */
export default function BrailleBox(props: Readonly<{ text: string }>) {
  const textPips = latinStringToCells(props.text);

  return (
    <div className="braille-box">
      <div>
        {textPips.map((cell, index) => (
          <BrailleCharacter key={index} cell={cell} />
        ))}
      </div>

      {props.text && CopyButton.isSupported() && (
        <>
          <hr />
          <CopyButton
            textToCopy={textPips.reduce(
              (prevText, cell) => prevText + cellToUnicode(cell),
              ""
            )}
          />
        </>
      )}
    </div>
  );
}
