import { useRef } from "react";
import { Cell, tryParseCell } from "./braille";
import "./braille-input.scss";

/**
 * A single braille character being displayed
 */
export default function BrailleInput(props: {
  onCharacter: (cell: Cell) => void;
}) {
  const pipsRef = useRef<HTMLSpanElement>(null);
  return (
    <div className="braille-input">
      <span ref={pipsRef}>
        {[...Array(6).keys()].map((id) => (
          <input type="checkbox" className="pip" data-pip={id + 1} key={id} />
        ))}
      </span>
      <button
        onClick={() => {
          const pips = pipsRef.current;
          if (!pips) {
            return;
          }

          const allPips = pips.querySelectorAll("input");

          const pipIds = [];
          for (const child of allPips) {
            if (child.checked) {
              pipIds.push(parseInt(child.dataset["pip"] ?? "", 10));
            }
          }
          const maybeCell = tryParseCell(pipIds);
          if (maybeCell !== null) {
            for (const child of allPips) {
              child.checked = false;
            }
            props.onCharacter(maybeCell);
          }
        }}
      >
        ❭
      </button>
    </div>
  );
}
