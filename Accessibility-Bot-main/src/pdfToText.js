import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist/webpack";
import "./ImageToText.css";

const PdfToText = () => {
  const [fileName, setFileName] = useState(null);
  const [text, setText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setText("");
    setIsExtracting(true);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      loadingTask.onProgress = (p) => {
        // p.loaded / p.total is not always available; approximate
        if (p && p.loaded && p.total) {
          setProgress(Math.round((p.loaded / p.total) * 100));
        }
      };

      const pdf = await loadingTask.promise;
      // For single-page document, read page 1; if multi-page, concatenate
      let fullText = "";
      const numPages = pdf.numPages || 1;
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item) => item.str || "");
        fullText += strings.join(" ") + (i < numPages ? "\n\n" : "");
        setProgress(Math.round((i / numPages) * 100));
      }

      setText(fullText.trim());
    } catch (err) {
      console.error("Error extracting PDF text:", err);
      setText("Error extracting text from PDF.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleCancel = () => {
    setFileName(null);
    setText("");
    setProgress(0);
    setFileInputKey(Date.now());
  };

  return (
    <div className={`image-to-text-container`}>
      <header className="page-header">
        <h1 className="page-title">PDF to Text Converter</h1>
      </header>
      <main>
        <div className="content">
          <input
            key={fileInputKey}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileUpload}
            disabled={isExtracting}
            aria-label="Upload a PDF to extract text"
          />

          {fileName && (
            <div className="image-preview">
              <div className="uploaded-image" aria-hidden>
                <strong>Selected file:</strong> {fileName}
              </div>
              <button className="cancel-button" onClick={handleCancel} aria-label="Choose another PDF">
                Choose another PDF
              </button>
            </div>
          )}

          {isExtracting && (
            <div className="progress">
              <p>Extracting... {progress}%</p>
            </div>
          )}

          <div className="extracted-text">
            <h2>Extracted Text:</h2>
            <pre style={{whiteSpace: 'pre-wrap'}}>{text || "Upload a PDF and the extracted text will appear here."}</pre>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PdfToText;
