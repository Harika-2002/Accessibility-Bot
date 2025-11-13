import React, { useState } from "react";
import Tesseract from "tesseract.js";
import "./ImageToText.css";

const ImageToText = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);
  const [isExtracting, setIsExtracting] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [statusMessage, setStatusMessage] = useState(""); // ✅ Accessible status

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      extractTextFromImage(file);
    }
  };

  const extractTextFromImage = (file) => {
    setIsExtracting(true);
    setText("");
    setProgress(0);
    setStatusMessage("🔄 Extracting text..."); // Initial status for screen readers

    Tesseract.recognize(file, "eng", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          const percent = Math.round(m.progress * 100);
          setProgress(percent);
          setStatusMessage(`🔄 Extracting text: ${percent}% complete`);
        }
      },
    })
      .then(({ data: { text } }) => {
        setText(text);
        setStatusMessage("✅ Extraction complete.");
        setIsExtracting(false);
      })
      .catch((error) => {
        console.error("Error extracting text:", error);
        setStatusMessage("❌ Extraction failed.");
        setIsExtracting(false);
      });
  };

  const handleCancel = () => {
    setImage(null);
    setText("");
    setProgress(0);
    setFileInputKey(Date.now());
    setStatusMessage("");
  };

  return (
    <div className="image-to-text-container">
      <header className="page-header">
        <h1 className="page-title">Image to Text Converter</h1>
      </header>
      <main>
        <div className="content">
          <input
            key={fileInputKey}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isExtracting}
            aria-label="Upload an image to extract text"
          />

          {image && (
            <div className="image-preview">
              <img src={image} alt="Uploaded" className="uploaded-image" />
              <button
                className="cancel-button"
                onClick={handleCancel}
                aria-label="Retry another image"
              >
                Retry another image
              </button>
            </div>
          )}

          {/* ✅ Accessible status for screen readers */}
          <div role="status" aria-live="polite" className="status-message">
            {statusMessage}
          </div>

          {isExtracting && (
            <div className="progress">
              <p>Extracting... {progress}%</p>
            </div>
          )}

          <div className="extracted-text">
            <h2>Extracted Text:</h2>
            <p>{text || "Text will appear here after extraction."}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ImageToText;