import { cellToUnicode, textToBraille } from "./braille";
import BrailleCharacter from "./braille-character";
import "./braille-box.scss";
import CopyButton from "./copy-button";

/**
 * Displays braille text
 */
export default function BrailleBox(props: Readonly<{ text: string }>) {
  const textPips = textToBraille(props.text) ?? [];

  return (
    <div className="braille-box">
      <div>
        {textPips.map(({ cells }, index) =>
          cells.map((cell) => <BrailleCharacter key={index} cell={cell} />)
        )}
      </div>

      {props.text && CopyButton.isSupported() && (
        <>
          <hr />
          <CopyButton
            textToCopy={textPips.reduce(
              (prevText, { cells }) =>
                prevText + cells.map(cellToUnicode).join(""),
              ""
            )}
          />
        </>
      )}
    </div>
  );
}
