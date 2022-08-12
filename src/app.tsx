import { useState } from "react";
import "./app.scss";
import { latinStringToCells } from "./braille";
import BrailleCharacter from "./braille-character";

/**
 * Main application
 */
export default function App() {
  const [message, setMessage] = useState("");

  const messagePips = latinStringToCells(message);

  const brailleCharacters = messagePips.map((cell, index) => (
    <BrailleCharacter key={index} cell={cell} />
  ));

  return (
    <main className="App">
      <h1>Braille Translator</h1>
      <input
        type="text"
        onChange={(e) => setMessage(e.currentTarget.value)}
        placeholder="Type text to translate..."
      />
      <p>
        Unified English Braille appears here...
        <br />
        <br />
        <div id="brailleTranslation"> {brailleCharacters} </div>
      </p>
    </main>
  );
}
