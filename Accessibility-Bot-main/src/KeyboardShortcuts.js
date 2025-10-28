import React from "react";
import "./KeyboardShortcuts.css";

const shortcuts = [
  { keys: "Alt + k", description: "KeyBoard Shortcuts" },
  { keys: "Ctrl + g", description: "Google" },
  { keys: "Ctrl + i", description: "Instagram" },
  { keys: "Ctrl + y", description: "Twitter" },
  { keys: "Ctrl + z", description: "Threads" },
  { keys: "Ctrl + j", description: "Jira" },
  { keys: "Ctrl + a", description: "Atlassian" },
  { keys: "Alt + g", description: "Github" },
  { keys: "Ctrl + v", description: "Vercel" },
  { keys: "Ctrl + l", description: "LinkedIn" },
  { keys: "Ctrl + f", description: "Facebook" },
  { keys: "Ctrl + b", description: "Youtube" },
  { keys: "Ctrl + m", description: "Toggle Mode" },
  { keys: "Alt + l", description: "Language Selection" },
  { keys: "Ctrl + d", description: "Interactive Dictionary" },
  { keys: "Alt + s", description: "Speech to Text" },
  { keys: "Alt + n", description: "Text to Speech" },
  { keys: "Alt + m", description: "Text Summarization" },
  { keys: "Ctrl + p", description: "Paraphrasing" },
  { keys: "Alt + f", description: "Image to Text Conversion" },
  { keys: "Alt + p", description: "Navigate to Profile" },
  { keys: "Alt + c", description: "Navigate to Change Password" },
  { keys: "Alt + h", description: "Navigate to Help" },
  { keys: "Alt + z", description: "Logout" },
  { keys: "Alt + o", description: "Navigate to Delete Account" },
];

const KeyboardShortcuts = () => {
  return (
    <div className="container">
      <h1>Keyboard Shortcuts</h1>
      <main>
        <ul className="shortcuts-list">
          {shortcuts.map((shortcut, index) => (
            <li key={index} className="shortcut-item">
              <span className="shortcut-key">{shortcut.keys}</span>
              <span className="hyphen"> - </span>
              <span className="description">{shortcut.description}</span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default KeyboardShortcuts;
