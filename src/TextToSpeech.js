import React, { useState, useEffect } from "react";
import { FaPlay, FaPause, FaTimes } from "react-icons/fa";
import * as pdfjsLib from "pdfjs-dist";
import { GlobalWorkerOptions } from "pdfjs-dist/build/pdf";
import "./TextToSpeech.css";

// ✅ Correct worker setup for Create React App
GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;

const TextToSpeech = () => {
  const [text, setText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [volume, setVolume] = useState(1);
  const [utterance, setUtterance] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [fileInputKey, setFileInputKey] = useState("");
  const speechSynthesisInstance = window.speechSynthesis;

  useEffect(() => {
    if (utterance && isSpeaking) {
      utterance.volume = volume;
    }
  }, [volume, utterance, isSpeaking]);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const extractTextFromPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let extractedText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(" ");
      extractedText += pageText + "\n\n";
    }

    return extractedText;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFileName(file.name);

    if (file.type === "application/pdf") {
      try {
        const pdfText = await extractTextFromPDF(file);
        setText(pdfText);
      } catch (error) {
        console.error("Error reading PDF:", error);
        alert("Unable to read PDF file. Please try another one.");
      }
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        setText(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleClearFile = () => {
    setUploadedFileName("");
    setText("");
    setFileInputKey(Date.now());
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
      setIsPaused(false);
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
    setVolume(parseFloat(e.target.value));
  };

  return (
    <div className="text-to-speech-container">
      <h1>Text to Speech Converter</h1>
      <main>
        <div className="textarea-container">
          <label htmlFor="textInput">Enter text:</label>
          <textarea
            id="textInput"
            className="text-box"
            placeholder="Enter or upload text here"
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
          <label htmlFor="fileUpload">Upload file (.txt or .pdf):</label>
          <input
            id="fileUpload"
            key={fileInputKey}
            type="file"
            onChange={handleFileUpload}
            accept=".txt, .pdf"
            aria-label="Upload text or PDF file"
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

          {(isSpeaking || isPaused) && (
            <button
              onClick={handleTogglePauseResume}
              aria-label={isPaused ? "Resume speech" : "Pause speech"}
            >
              {isPaused ? <FaPlay /> : <FaPause />}
            </button>
          )}

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
