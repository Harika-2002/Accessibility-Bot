import React, { useState, useRef } from "react";
import { FaMicrophone } from "react-icons/fa";
import "./SpeechToText.css";

const SpeechToText = () => {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);

  // Initialize SpeechRecognition only once
  const initRecognition = () => {
    if (!recognitionRef.current) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert("Speech Recognition is not supported in this browser.");
        return null;
      }

      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-US";

      rec.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setText(transcript);
        setIsListening(false);
      };

      rec.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
    return recognitionRef.current;
  };

  const handleListen = async () => {
    const rec = initRecognition();
    if (!rec) return;

    // Request mic permission explicitly
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      alert("Microphone permission denied.");
      return;
    }

    if (isListening) {
      rec.stop();
      setIsListening(false);
    } else {
      rec.start();
      setIsListening(true);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "speech-to-text.txt";
    element.click();
  };

  return (
    <div className="speech-to-text-container">
      <header>
        <h1 className="h1">Speech to Text Converter</h1>
      </header>
      <main>
        <div className="mic-container">
          <FaMicrophone
            onClick={handleListen}
            size={50}
            className={isListening ? "mic-listening" : "mic-idle"}
            style={{
              cursor: "pointer",
              color: isListening ? "#d32f2f" : "#1976d2",
            }}
            aria-label={isListening ? "Stop listening" : "Start listening"}
            aria-pressed={isListening}
          />
          <p>
            {isListening ? "Listening..." : "Click the microphone to start speaking"}
          </p>
        </div>

        <textarea
          className="text-box"
          placeholder="Your speech will be converted here"
          value={text}
          readOnly
        />

        {text && (
          <button className="download-btn" onClick={handleDownload}>
            Download Text
          </button>
        )}
      </main>
    </div>
  );
};

export default SpeechToText;