import React, { useState } from "react";
import { FaMicrophone } from "react-icons/fa";
import "./SpeechToText.css";

const SpeechToText = () => {
  const [text, setText] = useState(""); // Store the converted speech to text
  const [isListening, setIsListening] = useState(false); // Manage listening state

  // Check if the browser supports SpeechRecognition
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  // Handle starting and stopping the speech recognition
  const handleListen = () => {
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }

    recognition.onresult = (event) => {
      const speechToText = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      setText(speechToText);
      setIsListening(false); // Stop listening after capturing speech
    };

    recognition.onerror = (event) => {
      console.error("Error occurred in speech recognition:", event.error);
    };
  };

  // Handle downloading the text as a file
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "speech-to-text.txt";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="speech-to-text-container">
      {/* <h1>Speech to Text Converter</h1> */}
      <header>
        <h1 className="h1">Speech to Text Converter</h1>
      </header>
      <main>
        <div className="mic-container">
          <FaMicrophone
            onClick={handleListen}
            size={50}
            className={isListening ? "mic-listening" : "mic-idle"}
            style={{ cursor: "pointer" }}
          />
          <p>
            {isListening
              ? "Listening..."
              : "Click the microphone and start speaking"}
          </p>
        </div>

        <textarea
          className="text-box"
          placeholder="Your speech will be converted to text here"
          value={text}
          readOnly
          aria-label="Your speech will be converted to text here"
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
