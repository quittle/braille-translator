import { useState } from "react";
import BrailleBox from "./braille-box";
import BrailleToLatin from "./braille-to-latin";
import "./app.scss";

/**
 * Main application
 */
export default function App() {
  const [message, setMessage] = useState("");

  return (
    <main className="App">
      <h1>Braille Translator</h1>
      <section>
        <h2>Braille to text</h2>
        <p>
          Click the pips of the braille cell on the left to fill it out, then
          press the botton to the right of it to enter it.
        </p>
        <BrailleToLatin />
      </section>
      <section>
        <h2>Translate text to Braille</h2>
        <input
          type="text"
          onChange={(e) => setMessage(e.currentTarget.value)}
          placeholder="Type text to translate&hellip;"
        />
        <p>Unified English Braille appears here&hellip;</p>

        <BrailleBox text={message} />
      </section>
    </main>
  );
}
