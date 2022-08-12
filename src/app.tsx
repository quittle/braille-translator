import { useState } from "react";
import "./app.scss";
import BrailleBox from "./braille-box";

/**
 * Main application
 */
export default function App() {
  const [message, setMessage] = useState("");

  return (
    <main className="App">
      <h1>Braille Translator</h1>
      <input
        type="text"
        onChange={(e) => setMessage(e.currentTarget.value)}
        placeholder="Type text to translate..."
      />
      <p>Unified English Braille appears here...</p>

      <BrailleBox text={message} />
    </main>
  );
}
