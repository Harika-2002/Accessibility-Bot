import React, { useState } from 'react';
import './SummarizetheText.css';

const SummarizetheText = () => {
    const [text, setText] = useState('');
    const [summary, setSummary] = useState('');
    const [uploadedFileName, setUploadedFileName] = useState('');
    const [fileInputKey, setFileInputKey] = useState(Date.now());

    // Function to handle text input changes
    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    // Function to handle file upload and set file content to text input
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                setText(event.target.result);
                setUploadedFileName(file.name);
            };
            reader.readAsText(file);
        }
    };

    // Improved summarization algorithm
    const summarizeText = () => {
        if (text.trim() === '') {
            alert('Please enter text or upload a file.');
            return;
        }

        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        if (sentences.length < 3) {
            setSummary(text);
            return;
        }

        const wordFreq = {};
        const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
        words.forEach(word => {
            if (word.length > 3) {
                wordFreq[word] = (wordFreq[word] || 0) + 1;
            }
        });

        const sentenceScores = sentences.map(sentence => {
            const sentenceWords = sentence.toLowerCase().split(/\s+/);
            const score = sentenceWords.reduce((acc, word) => acc + (wordFreq[word] || 0), 0);
            return { sentence, score };
        });

        const topSentences = sentenceScores
            .sort((a, b) => b.score - a.score)
            .slice(0, Math.ceil(sentences.length / 3))
            .sort((a, b) => sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence))
            .map(s => s.sentence);

        setSummary(topSentences.join(' '));
    };

    // Clear file, reset text, and remove summary
    const handleClear = () => {
        setUploadedFileName('');
        setText('');
        setSummary('');
        setFileInputKey(Date.now());
    };

    return (
        <div className="summarize-text-container">
            <h2>Text Summarization Tool</h2>
            <div className="textarea-container">
                <textarea
                    className="text-box"
                    placeholder="Enter text or upload a file to summarize"
                    value={text}
                    onChange={handleTextChange}
                    aria-label="Enter text to summarize"
                />
            </div>

            {/* Display uploaded file name with option to clear */}
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

            <button onClick={summarizeText} className="summarize-btn">
                Summarize Text
            </button>

            {/* Display the summary if available */}
            {summary && (
                <div className="summary-container">
                    <h3>Summary</h3>
                    <p>{summary}</p>
                </div>
            )}

            {/* Add a button to clear both text and summary */}
            {(text || summary) && (
                <button onClick={handleClear} className="clear-all-btn">
                    Clear Summary & Text
                </button>
            )}
        </div>
    );
};

export default SummarizetheText;
