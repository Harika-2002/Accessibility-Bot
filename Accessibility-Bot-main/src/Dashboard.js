import React, { useState, useEffect, useRef } from "react";
import "./Dashboard.css";
import botImage from "./assets/bot.jpeg";
import homeIcon from "./assets/icons8-home-52.png";
import helpIcon from "./assets/icons8-help-50.png";
import zoomInIcon from "./assets/icons8-zoom-in-48.png";
import zoomOutIcon from "./assets/icons8-zoom-out-50.png";
import accountIcon from "./assets/icons8-account-50.png";
import voiceIcon from "./assets/icons8-microphone-48.png";
import sendIcon from "./assets/icons8-send-48.png";
import nightModeIcon from "./assets/icons8-night-mode-50.png";
import brightModeIcon from "./assets/icons8-bright-button-48.png";
import logoutIcon from "./assets/icons8-logout-50.png";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ showSidebar }) => {
  const [isNightMode, setIsNightMode] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  const toggleNightMode = () => {
    setIsNightMode(!isNightMode);
  };

  const handleZoomIn = () => {
    if (zoomLevel < 100) setZoomLevel(zoomLevel + 5);
  };

  const handleZoomOut = () => {
    if (zoomLevel > 50) setZoomLevel(zoomLevel - 5);
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleAccountDropdown = () =>
    setIsAccountDropdownOpen(!isAccountDropdownOpen);

  const handleVoiceInputToggle = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      startListening();
    }
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(
        "Speech Recognition is not supported in this browser. Please try using Chrome."
      );
      return;
    }

    window.speechSynthesis.cancel();
    const recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      setChatMessage(transcript);
      if (event.results[0].isFinal) {
        handleNavigationCommand(transcript.toLowerCase());
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => setIsRecording(false);
    recognition.start();
    recognitionRef.current = recognition;
  };

  const handleNavigationCommand = (command) => {
    window.speechSynthesis.cancel();

    let destination;
    let actionTaken = false;
    const websiteMap = {
      google: "https://www.google.com",
      youtube: "https://www.youtube.com",
      facebook: "https://www.facebook.com",
      instagram: "https://www.instagram.com",
      twitter: "https://www.twitter.com",
      threads: "https://www.threads.net",
      jira: "https://www.atlassian.com/software/jira",
      figma: "https://www.figma.com",
      github: "https://www.github.com",
      vercel: "https://www.vercel.com",
    };

    const siteName = Object.keys(websiteMap).find((site) =>
      command.includes(site)
    );
    if (
      siteName &&
      (command.includes("go to") ||
        command.includes("navigate to") ||
        command.includes("open"))
    ) {
      const url = websiteMap[siteName];
      window.open(url, "_blank");
      return;
    }
    if (command.includes("help")) {
      destination = "/help";
    } else if (command.includes("toggle mode")) {
      toggleNightMode();
      actionTaken = true;
    } else if (command.includes("text magnification")) {
      toggleDropdown();
      actionTaken = true;
    } else if (command.includes("view account")) {
      destination = "/view-account";
    } else if (command.includes("change password")) {
      destination = "/change-password";
    } else if (command.includes("delete account")) {
      destination = "/delete-account";
    } else if (command.includes("log out")) {
      destination = "/login";
    } else if (command.includes("text to speech")) {
      destination = "/text-to-speech";
    } else if (command.includes("speech to text")) {
      destination = "/speech-to-text";
    } else if (command.includes("image to text")) {
      destination = "/image-to-text";
    } else if (command.includes("keyboard shortcuts")) {
      destination = "/keyboardshortcuts";
    } else if (
      command.includes("multi-language") ||
      command.includes("summarization") ||
      command.includes("paraphrasing") ||
      command.includes("dictionary")
    ) {
      const urls = {
        "multi-language": "https://accessibility-bot-multilang.vercel.app/",
        summarization: "https://accessibility-bot-text-summarize.vercel.app/",
        paraphrasing: "https://accessibility-bot-text-paraphrase.vercel.app/",
        dictionary:
          "https://accessibility-bot-interactive-dictionary.vercel.app/",
      };
      window.open(urls[command.split(" ").find((key) => urls[key])], "_blank");
      actionTaken = true;
    }

    if (destination) {
      const confirmMessage = new SpeechSynthesisUtterance(
        "Navigating to your requested page."
      );
      window.speechSynthesis.speak(confirmMessage);
      navigate(destination);
    } else if (!actionTaken) {
      const retryMessage = new SpeechSynthesisUtterance(
        "I did not understand. Please try again."
      );
      window.speechSynthesis.speak(retryMessage);
    } else {
      const actionMessage = new SpeechSynthesisUtterance(
        "Action completed successfully."
      );
      window.speechSynthesis.speak(actionMessage);
    }
  };

  const handleSendMessage = () => {
    if (chatMessage.trim() === "") {
      alert("Please enter or say something!");
      return;
    }

    console.log("Message sent:", chatMessage);

    handleNavigationCommand(chatMessage.toLowerCase());

    setChatMessage("");
  };

  const handleLogout = () => {
    // Clear any persisted login state
    try {
      localStorage.removeItem("isLoggedIn");
    } catch (e) {
      // ignore
    }
    // Show confirmation popup then redirect to login
    alert("You have been logged out successfully.");
    navigate("/login");
  };

  useEffect(() => {
    const handleWindowBlur = () => {
      if (isDropdownOpen || isAccountDropdownOpen) {
        setIsDropdownOpen(false);
        setIsAccountDropdownOpen(false);
      }
    };

    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".zoom-dropdown-content") &&
        !e.target.closest(".account-dropdown") &&
        !e.target.closest(".zoom-dropdown") &&
        !e.target.closest(".nav-item")
      ) {
        setIsDropdownOpen(false);
        setIsAccountDropdownOpen(false);
      }
    };

    window.addEventListener("blur", handleWindowBlur);
    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownOpen, isAccountDropdownOpen]);

  return (
    <div
      className={`dashboard ${isNightMode ? "night-mode" : "bright-mode"} ${
        showSidebar ? "sidebar-active" : ""
      }`}
      style={{
        fontSize: `${zoomLevel}%`,
        transform: `scale(${zoomLevel / 100})`,
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Add the page heading */}
      <header className="dashboard-header">
        <h1 className="dashboard-title">Accessibility Dashboard</h1>
      </header>
      <div className="navbar" style={{ fontSize: `${zoomLevel * 1.0}rem` }}>
        <img src={botImage} alt="Bot Logo" className="bot-logo" />
        <div className="nav-items">
          <div className="nav-item active">
            <img src={homeIcon} alt="" className="nav-icon" />
            HOME
          </div>
          <div className="nav-item" onClick={() => navigate("/help")}>
            <img src={helpIcon} alt="" className="nav-icon" />
            HELP
          </div>
          <div className="nav-item zoom-dropdown" onClick={toggleDropdown}>
            <img src={zoomInIcon} alt="" className="nav-icon" />
            Text Magnification
            {isDropdownOpen && (
              <div className="zoom-dropdown-content">
                <div onClick={handleZoomIn}>
                  <img src={zoomInIcon} alt="Zoom In" className="zoom-icon" />{" "}
                  Zoom In
                </div>
                <div onClick={handleZoomOut}>
                  <img src={zoomOutIcon} alt="" className="zoom-icon" /> Zoom
                  Out
                </div>
              </div>
            )}
          </div>
          <div className="nav-item" onClick={toggleNightMode}>
            <img
              src={isNightMode ? nightModeIcon : brightModeIcon}
              alt=""
              className="nav-icon"
            />
            {isNightMode ? "Light Mode" : "Dark Mode"}
          </div>
          <div className="nav-item" onClick={toggleAccountDropdown}>
            <img src={accountIcon} alt="" className="nav-icon" />
            YOUR ACCOUNT
            {isAccountDropdownOpen && (
              <div className="account-dropdown">
                <div
                  className="dropdown-item"
                  onClick={() => navigate("/view-account")}
                >
                  View Account Info
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => navigate("/change-password")}
                >
                  Change Password
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => navigate("/delete-account")}
                >
                  Delete My Account
                </div>
              </div>
            )}
          </div>
          <div className="nav-item" onClick={handleLogout}>
            <img src={logoutIcon} alt="" className="nav-icon" />
            LOGOUT
          </div>
        </div>
      </div>

      {showSidebar && (
        <div className="sidebar" style={{ fontSize: `${zoomLevel * 1.0}rem` }}>
          <ul>
            <li onClick={() => navigate("/text-to-speech")}>Text to Speech</li>
            <li onClick={() => navigate("/speech-to-text")}>Speech to Text</li>
            <li
              onClick={() =>
                (window.location.href =
                  "https://accessibility-bot-multilang.vercel.app/")
              }
            >
              MultiLanguage
            </li>
            <li onClick={() => navigate("/image-to-text")}>Image to Text</li>
            <li
              onClick={() =>
                (window.location.href =
                  "https://accessibility-bot-text-summarize.vercel.app/")
              }
            >
              Summarize the Text
            </li>
            <li
              onClick={() =>
                (window.location.href =
                  "https://accessibility-bot-text-paraphrase.vercel.app/")
              }
            >
              Paraphrase or Simple Text
            </li>
            <li
              onClick={() =>
                (window.location.href =
                  "https://accessibility-bot-interactive-dictionary.vercel.app/")
              }
            >
              Interactive Dictionary
            </li>
            <li onClick={() => navigate("/keyboardshortcuts")}>
              Keyboard Shortcuts
            </li>
          </ul>
        </div>
      )}

      <div
        className="chat-input-box-container"
        style={{ fontSize: `${zoomLevel * 1.0}rem`, maxHeight: "15%" }}
      >
        <div className="chat-input-box">
          <input
            type="text"
            placeholder="Message the bot and chat here"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            aria-label="Chat message input"
          />
          <button
            className="icon-btn voice-btn"
            onClick={handleVoiceInputToggle}
          >
            <img src={voiceIcon} alt="Voice Command" />
          </button>
          <button className="icon-btn send-btn" onClick={handleSendMessage}>
            <img src={sendIcon} alt="Send Message" />
          </button>
        </div>
        {isRecording && <p>Recording voice...</p>}
      </div>
    </div>
  );
};

export default Dashboard;
