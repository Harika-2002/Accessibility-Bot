import React, { useState, useEffect } from "react";
import { FaPlay, FaPause, FaTimes } from "react-icons/fa"; // Import icons for play, pause, and clear
import "./TextToSpeech.css";

const TextToSpeech = () => {
  const [text, setText] = useState(""); // Store the input text
  const [isSpeaking, setIsSpeaking] = useState(false); // Manage speaking state
  const [isPaused, setIsPaused] = useState(false); // Manage pause/resume state
  const [volume, setVolume] = useState(1); // Volume control (1 = 100%)
  const [utterance, setUtterance] = useState(null); // Current speech utterance
  const [uploadedFileName, setUploadedFileName] = useState(""); // Store the file name
  const [fileInputKey, setFileInputKey] = useState(""); // Track key for resetting file input
  const speechSynthesisInstance = window.speechSynthesis;

  useEffect(() => {
    if (utterance && isSpeaking) {
      utterance.volume = volume; // Ensure the volume is updated for the current utterance
    }
  }, [volume, utterance, isSpeaking]);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        setText(event.target.result); // Display file content in the textarea
        setUploadedFileName(file.name); // Display the file name
      };
      reader.readAsText(file);
    }
  };

  const handleClearFile = () => {
    setUploadedFileName(""); // Remove the file name display
    setText(""); // Clear the text from the text box too
    setFileInputKey(Date.now()); // Reset file input by changing its key
  };

  const handleSpeak = () => {
    if (text.trim() === "") {
      alert("Please enter text or upload a file.");
      return;
    }

    speechSynthesisInstance.cancel();

    const newUtterance = new SpeechSynthesisUtterance(text);
    newUtterance.volume = volume;

    newUtterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false); // Reset the paused state when speech ends
    };

    setUtterance(newUtterance);
    speechSynthesisInstance.speak(newUtterance);
    setIsSpeaking(true);
    setIsPaused(false);
  };

  const handleTogglePauseResume = () => {
    if (isPaused) {
      speechSynthesisInstance.resume();
      setIsPaused(false);
      setIsSpeaking(true);
    } else {
      speechSynthesisInstance.pause();
      setIsPaused(true);
      setIsSpeaking(false);
    }
  };

  const handleStop = () => {
    speechSynthesisInstance.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const handleClearText = () => {
    setText("");
    handleStop();
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume); // Set volume for new utterances
  };

  return (
    <div className="text-to-speech-container">
      <h1>Text to Speech Converter</h1> {/* Add a main heading */}
      <main>
        <div className="textarea-container">
          <label htmlFor="textInput">Enter text:</label>
          <textarea
            id="textInput"
            className="text-box"
            placeholder="Enter text here"
            value={text}
            onChange={handleTextChange}
            aria-label="Enter text here"
          />
          {text && (
            <FaTimes
              className="clear-text"
              onClick={handleClearText}
              aria-label="Clear text"
            />
          )}
        </div>

        {uploadedFileName && (
          <div className="file-info">
            <span>{uploadedFileName}</span>
            <FaTimes
              className="clear-file"
              onClick={handleClearFile}
              aria-label="Clear uploaded file"
            />
          </div>
        )}
        <div className="upload-container">
          <label htmlFor="fileUpload">Upload text file:</label>
          <input
            id="fileUpload"
            key={fileInputKey} // Add key to reset input on file clear
            type="file"
            onChange={handleFileUpload}
            accept=".txt"
            aria-label="Upload text file"
          />
        </div>
        <div className="controls">
          <button
            onClick={handleSpeak}
            disabled={isSpeaking && !isPaused}
            aria-label="Convert text to speech"
          >
            Convert to Speech
          </button>

          {isSpeaking || isPaused ? (
            <button
              onClick={handleTogglePauseResume}
              aria-label={isPaused ? "Resume speech" : "Pause speech"}
            >
              {isPaused ? <FaPlay /> : <FaPause />}
            </button>
          ) : null}

          <button onClick={handleStop} aria-label="Stop speech">
            Stop
          </button>
        </div>
        <div className="volume-control">
          <label htmlFor="volumeSlider">Volume:</label>
          <input
            id="volumeSlider"
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
            aria-label="Adjust volume"
          />
        </div>
      </main>
    </div>
  );
};

export default TextToSpeech;
