import React, { useState } from "react";
import Tesseract from "tesseract.js";
import "./ImageToText.css";

const ImageToText = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);
  const [isExtracting, setIsExtracting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(""); // ✅ Added: clear text feedback
  const [fileInputKey, setFileInputKey] = useState(Date.now());

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
    setStatusMessage("🔄 Extracting text from image... Please wait."); // ✅ Accessible status

    Tesseract.recognize(file, "eng", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          setProgress(Math.round(m.progress * 100));
        }
      },
    })
      .then(({ data: { text } }) => {
        setText(text);
        setIsExtracting(false);
        setStatusMessage("✅ Text extraction complete!"); // ✅ Meaningful text message
      })
      .catch((error) => {
        console.error("Error extracting text:", error);
        setIsExtracting(false);
        setStatusMessage("❌ Error: Unable to extract text. Please try another image."); // ✅ Accessible error feedback
      });
  };

  const handleCancel = () => {
    setImage(null);
    setText("");
    setProgress(0);
    setFileInputKey(Date.now());
    setStatusMessage("ℹ️ Upload canceled. You can select a new image."); // ✅ Clear feedback
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
                style={{
                  backgroundColor: "#005fcc",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Retry another image
              </button>
            </div>
          )}

          {isExtracting && (
            <div className="progress" role="status" aria-live="polite">
              <p>Extracting... {progress}%</p>
            </div>
          )}

          {/* ✅ Accessible status feedback */}
          <div
            role="status"
            aria-live="polite"
            className={`feedback ${
              statusMessage.includes("✅")
                ? "success"
                : statusMessage.includes("❌")
                ? "error"
                : ""
            }`}
          >
            {statusMessage}
          </div>

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