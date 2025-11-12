// src/ParaphraseOrSimpleText.js
import React, { useState } from 'react';
import './ParaphraseOrSimpleText.css';

const ParaphraseOrSimpleText = () => {
  const [text, setText] = useState('');
  const [paraphrasedText, setParaphrasedText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const handleTextChange = (e) => setText(e.target.value);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setText(event.target.result);
        setUploadedFileName(file.name);
      };
      reader.readAsText(file);
    }
  };

  const paraphraseText = () => {
    if (text.trim() === '') {
      alert('Please enter text or upload a file.');
      return;
    }

    // Split the text into sentences
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    
    // Randomly shuffle sentences and words within sentences
    const paraphrased = sentences
      .map(sentence => {
        const words = sentence.split(' ');
        return words.sort(() => Math.random() - 0.5).join(' ');
      })
      .sort(() => Math.random() - 0.5)
      .join(' ');

    setParaphrasedText(paraphrased);
  };

  const handleClear = () => {
    setUploadedFileName('');
    setText('');
    setParaphrasedText('');
    setFileInputKey(Date.now());
  };

  return (
    <div className="paraphrase-text-container">
      <h2>Paraphrase Text Tool</h2>
      <div className="textarea-container">
        <textarea
          className="text-box"
          placeholder="Enter text or upload a file to paraphrase"
          value={text}
          onChange={handleTextChange}
          aria-label="Enter text to paraphrase"
        />
      </div>

      {uploadedFileName && (
        <div className="file-info">
          <span>{uploadedFileName}</span>
          <button onClick={handleClear} className="clear-file">
            Clear
          </button>
        </div>
      )}

      <div className="upload-container">
        <input
          key={fileInputKey}
          type="file"
          accept=".txt,.pdf,.docx"
          onChange={handleFileUpload}
          aria-label="Upload a text file"
        />
      </div>

      <button onClick={paraphraseText} className="paraphrase-btn">
        Paraphrase Text
      </button>

      {paraphrasedText && (
        <div className="paraphrase-result-container">
          <h3>Paraphrased Text</h3>
          <p>{paraphrasedText}</p>
        </div>
      )}

      {(text || paraphrasedText) && (
        <button onClick={handleClear} className="clear-all-btn">
          Clear Text & Paraphrased Result
        </button>
      )}
    </div>
  );
};

export default ParaphraseOrSimpleText;
