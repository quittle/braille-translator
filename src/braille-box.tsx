import { cellToUnicode, latinStringToCells } from "./braille";
import BrailleCharacter from "./braille-character";
import "./braille-box.scss";
import { ReactComponent as CopyIcon } from "./assets/icon-copy.svg";

/**
 * Displays braille text
 */
export default function BrailleBox(props: Readonly<{ text: string }>) {
  const textPips = latinStringToCells(props.text);

  const copyToClipboard = (e: React.MouseEvent<HTMLButtonElement>) => {
    const brailleText = textPips.reduce(
      (prevText, cell) => prevText + cellToUnicode(cell),
      ""
    );
    navigator.clipboard.writeText(brailleText);
  };

  return (
    <div className="braille-box">
      <div>
        {textPips.map((cell, index) => (
          <BrailleCharacter key={index} cell={cell} />
        ))}
      </div>

      {props.text && navigator.clipboard && (
        <>
          <hr />
          <button onClick={copyToClipboard}>
            <CopyIcon />
            Copy
          </button>
        </>
      )}
    </div>
  );
}
