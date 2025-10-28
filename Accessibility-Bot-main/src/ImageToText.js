import React, { useState } from "react";
import Tesseract from "tesseract.js"; // Import Tesseract for text extraction
import "./ImageToText.css";

const ImageToText = () => {
  const [image, setImage] = useState(null); // Stores the selected image URL
  const [text, setText] = useState(""); // Stores the extracted text
  const [progress, setProgress] = useState(0); // Tracks the progress of extraction
  const [isExtracting, setIsExtracting] = useState(false); // Indicates if text extraction is in progress
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // Tracks key for resetting file input

  // Handle image file upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setImage(URL.createObjectURL(file)); // Create an object URL for the image preview
      extractTextFromImage(file); // Extract text from the uploaded image
    }
  };

  // Extract text from the uploaded image using Tesseract
  const extractTextFromImage = (file) => {
    setIsExtracting(true); // Set extracting state to true
    setText(""); // Clear any previous text
    setProgress(0); // Reset progress

    Tesseract.recognize(file, "eng", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          setProgress(Math.round(m.progress * 100)); // Update progress
        }
      },
    })
      .then(({ data: { text } }) => {
        setText(text); // Set the extracted text
        setIsExtracting(false); // Set extracting state to false
      })
      .catch((error) => {
        console.error("Error extracting text:", error);
        setIsExtracting(false); // Handle errors and stop extracting
      });
  };

  // Cancel the current image and reset everything
  const handleCancel = () => {
    setImage(null); // Remove the image preview
    setText(""); // Clear the extracted text
    setProgress(0); // Reset progress
    setFileInputKey(Date.now()); // Reset file input field to allow re-upload
  };

  return (
    <div className="image-to-text-container">
      <h1>Image to Text Converter</h1>
      <main>
        {/* File input to select an image */}
        <input
          key={fileInputKey} // Reset file input when necessary
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={isExtracting} // Disable input while extracting
          aria-label="Upload an image to extract text"
        />

        {/* Display image preview and cancel button if an image is uploaded */}
        {image && (
          <div className="image-preview">
            <img src={image} alt="Uploaded" className="uploaded-image" />
            <button className="cancel-button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        )}

        {/* Show progress while extracting text */}
        {isExtracting && (
          <div className="progress">
            <p>Extracting... {progress}%</p>
          </div>
        )}

        {/* Display the extracted text */}
        <div className="extracted-text">
          <h2>Extracted Text:</h2>
          <p>{text || "Text will appear here after extraction."}</p>
        </div>
      </main>
    </div>
  );
};

export default ImageToText;
