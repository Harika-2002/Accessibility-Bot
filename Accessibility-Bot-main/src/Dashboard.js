// Dashboard.js
import React, { useState, useEffect, useRef } from "react";
import "./Dashboard.css";
import botImage from "./assets/bot.jpeg";
import homeIcon from "./assets/icons8-home-52.png";
import helpIcon from "./assets/icons8-help-50.png";
import zoomInIcon from "./assets/icons8-zoom-in-48.png";
import accountIcon from "./assets/icons8-account-50.png";
import voiceIcon from "./assets/icons8-microphone-48.png";
import sendIcon from "./assets/icons8-send-48.png";
import nightModeIcon from "./assets/icons8-night-mode-50.png";
import brightModeIcon from "./assets/icons8-bright-button-48.png";
import logoutIcon from "./assets/icons8-logout-50.png";
import { useNavigate } from "react-router-dom";
import { useAccessibility } from "./AccessibilityContext";

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// Localization strings (can be moved to separate file)
const translations = {
  en: {
    title: "Accessibility Dashboard",
    home: "Home",
    help: "Help",
    zoomIn: "Zoom In",
    zoomOut: "Zoom Out",
    textMagnification: "Text Magnification",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    account: "Your Account",
    logout: "Logout",
    welcomeMessage:
      "Welcome — message or use voice commands to interact with the bot.",
    messagePlaceholder: "Message the bot...",
    recording: "Recording voice…",
    recordingStopped: "Recording stopped",
    // Add more translations as needed
  },
  // Add more languages: es, fr, de, etc.
};

export default function Dashboard({ showSidebar = true, isNightMode = false, onToggleNightMode = () => {} }) {
  const { zoomLevel, zoomIn, zoomOut, resetZoom } = useAccessibility(); // ⬅️ global zoom (default OFF)
  const [isZoomDropdownOpen, setIsZoomDropdownOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(showSidebar);
  const [chatHistory, setChatHistory] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [language, setLanguage] = useState("en"); // For localization - will be used in future features
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const recognitionRef = useRef(null);
  const srLiveRef = useRef(null);
  const navigate = useNavigate();

  const t = translations[language]; // Translation helper

  // Keep language + SR announcements in sync (but DO NOT apply zoom here)
  useEffect(() => {
    document.documentElement.lang = language; // Set document language
    if (srLiveRef.current) {
      const modeText = isNightMode ? "Dark mode on." : "Light mode on.";
      srLiveRef.current.textContent = `Zoom ${zoomLevel} percent. ${modeText}`;
    }
  }, [zoomLevel, isNightMode, language]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (
        !e.target.closest(".zoom-dropdown") &&
        !e.target.closest(".zoom-dropdown-content")
      ) {
        setIsZoomDropdownOpen(false);
      }
      if (
        !e.target.closest(".account-dropdown") &&
        !e.target.closest(".account-dropdown-toggle")
      ) {
        setIsAccountDropdownOpen(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const handleKeyActivate = (event, fn) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      fn();
    }
  };

  const handleZoomIn = () => {
    zoomIn(); // global
    announceToScreenReader(
      `Zoomed in to ${Math.min(zoomLevel + 10, 150)} percent`
    );
  };

  const handleZoomOut = () => {
    zoomOut(); // global
    announceToScreenReader(
      `Zoomed out to ${Math.max(zoomLevel - 10, 50)} percent`
    );
  };

  const toggleNightMode = () => {
    // Call parent toggle handler. Announce the new state based on current prop.
    const willBeDark = !isNightMode;
    onToggleNightMode();
    announceToScreenReader(willBeDark ? "Dark mode activated" : "Light mode activated");
  };

  const announceToScreenReader = (message) => {
    if (srLiveRef.current) {
      srLiveRef.current.textContent = message;
    }
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech Recognition not supported in this browser.");
      return;
    }

    setError(null);
    window.speechSynthesis.cancel();
    const recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.lang =
      language === "en" ? "en-US" : `${language}-${language.toUpperCase()}`;

    recognition.onstart = () => {
      setIsRecording(true);
      announceToScreenReader("Recording started.");
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join("");
      setChatMessage(transcript);
      if (event.results[0].isFinal)
        handleNavigationCommand(transcript.toLowerCase());
    };

    recognition.onerror = (event) => {
      console.error(event.error);
      setIsRecording(false);
      setError(`Speech recognition error: ${event.error}`);
      announceToScreenReader("Speech recognition error.");
    };

    recognition.onend = () => {
      setIsRecording(false);
      announceToScreenReader("Recording stopped.");
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const handleVoiceInputToggle = () => {
    if (isRecording) recognitionRef.current?.stop();
    else startListening();
  };

  const siteMapOpen = (site) => {
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
    if (websiteMap[site]) window.open(websiteMap[site], "_blank", "noopener");
  };

  const handleNavigationCommand = (command) => {
    window.speechSynthesis.cancel();
    let destination = null;
    let actionTaken = false;

    if (
      command.includes("go to") ||
      command.includes("open") ||
      command.includes("navigate to")
    ) {
      const site = Object.keys({
        google: 1,
        youtube: 1,
        facebook: 1,
        instagram: 1,
        twitter: 1,
        threads: 1,
        jira: 1,
        figma: 1,
        github: 1,
        vercel: 1,
      }).find((s) => command.includes(s));
      if (site) {
        siteMapOpen(site);
        actionTaken = true;
      }
    }

    if (command.includes("help")) destination = "/help";
    if (
      command.includes("toggle mode") ||
      command.includes("dark mode") ||
      command.includes("light mode")
    ) {
      toggleNightMode();
      actionTaken = true;
    }
    if (
      command.includes("zoom in") ||
      command.includes("magnify") ||
      command.includes("increase text")
    ) {
      handleZoomIn();
      actionTaken = true;
    }
    if (command.includes("zoom out") || command.includes("decrease text")) {
      handleZoomOut();
      actionTaken = true;
    }
    if (command.includes("view account")) destination = "/view-account";
    if (command.includes("change password")) destination = "/change-password";
    if (command.includes("delete account")) destination = "/delete-account";
    if (command.includes("log") && command.includes("out")) destination = "/login";
    if (command.includes("text to speech")) destination = "/text-to-speech";
    if (command.includes("speech to text")) destination = "/speech-to-text";
    if (command.includes("image to text")) destination = "/image-to-text";
    if (command.includes("PDF to text")) destination = "/pdf-to-text";
    if (command.includes("keyboard shortcuts")) destination = "/keyboardshortcuts";

    if (destination) {
      window.speechSynthesis.speak(
        new SpeechSynthesisUtterance("Navigating to your requested page.")
      );
      navigate(destination);
      return;
    }

    if (!actionTaken)
      window.speechSynthesis.speak(
        new SpeechSynthesisUtterance("I did not understand. Please try again.")
      );
    else
      window.speechSynthesis.speak(
        new SpeechSynthesisUtterance("Action completed successfully.")
      );
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) {
      setError("Please enter or say something!");
      return;
    }

    setError(null);
    setIsLoading(true);

    const userMsg = { id: Date.now(), sender: "user", text: chatMessage };
    setChatHistory((prev) => [...prev, userMsg]);
    setChatMessage("");

    setTimeout(() => {
      setIsLoading(false);
      setChatHistory((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "bot", text: "I heard you — working on it." },
      ]);
      handleNavigationCommand(chatMessage.toLowerCase());
    }, 500);
  };

  const handleLogout = () => {
    // Clear any persisted login state and inform the user
    try {
      localStorage.removeItem("isLoggedIn");
    } catch (e) {
      // ignore localStorage errors
    }
    // Provide a similar popup to the login flow and announce to SR
    alert("You have been logged out. Redirecting to login page...");
    announceToScreenReader("You have been logged out.");
    navigate("/login");
  };

  const sidebarClass = sidebarOpen ? "sidebar open" : "sidebar";

  // Add window resize handler for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (window.innerWidth <= 768 && sidebarOpen) {
        const sidebar = document.querySelector(".sidebar");
        const hamburger = document.querySelector(".hamburger-btn");

        if (sidebar && !sidebar.contains(e.target) && !hamburger?.contains(e.target)) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  return (
    <div
      className={`dashboard ${isNightMode ? "night-mode" : ""}`}
      lang={language}
      aria-live="polite"
    >
      {/* Header */}
      <header className="dashboard-header" role="banner">
        <div className="header-left">
          <button
            className="hamburger-btn"
            aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
            aria-pressed={sidebarOpen}
            onClick={() => setSidebarOpen((s) => !s)}
            onKeyDown={(e) => handleKeyActivate(e, () => setSidebarOpen((s) => !s))}
          >
            ☰
          </button>

          <img src={botImage} alt="Accessibility bot logo" className="bot-logo" />
          <h1 className="dashboard-title">{t.title}</h1>
        </div>

        <nav className="header-controls" role="navigation" aria-label="Top navigation">
          {/* Home */}
          <div
            className="nav-item nav-home"
            role="button"
            tabIndex={0}
            aria-current="page"
            title={t.home}
          >
            <img src={homeIcon} alt="" className="nav-icon" aria-hidden="true" />
            <span className="nav-label">{t.home}</span>
          </div>

          {/* Help */}
          <div
            className="nav-item"
            role="button"
            tabIndex={0}
            onClick={() => navigate("/help")}
            onKeyDown={(e) => handleKeyActivate(e, () => navigate("/help"))}
            aria-label={t.help}
          >
            <img src={helpIcon} alt="" className="nav-icon" aria-hidden="true" />
            <span className="nav-label">{t.help}</span>
          </div>

          {/* Zoom */}
          <div
            className="nav-item zoom-dropdown"
            role="button"
            tabIndex={0}
            aria-haspopup="true"
            aria-expanded={isZoomDropdownOpen}
            onClick={() => setIsZoomDropdownOpen((s) => !s)}
            onKeyDown={(e) =>
              handleKeyActivate(e, () => setIsZoomDropdownOpen((s) => !s))
            }
          >
            <img src={zoomInIcon} alt="" className="nav-icon" aria-hidden="true" />
            <span className="nav-label">
              {t.textMagnification} ({zoomLevel}%)
            </span>
            {isZoomDropdownOpen && (
              <div className="zoom-dropdown-content" role="menu">
                <div
                  role="menuitem"
                  tabIndex={0}
                  onClick={handleZoomIn}
                  onKeyDown={(e) => handleKeyActivate(e, handleZoomIn)}
                >
                  ➕ {t.zoomIn}
                </div>
                <div
                  role="menuitem"
                  tabIndex={0}
                  onClick={handleZoomOut}
                  onKeyDown={(e) => handleKeyActivate(e, handleZoomOut)}
                >
                  ➖ {t.zoomOut}
                </div>
                <div
                  role="menuitem"
                  tabIndex={0}
                  onClick={() => {
                    resetZoom();
                    announceToScreenReader("Zoom reset to 100 percent");
                  }}
                  onKeyDown={(e) =>
                    handleKeyActivate(e, () => {
                      resetZoom();
                      announceToScreenReader("Zoom reset to 100 percent");
                    })
                  }
                >
                  ♻️ Reset Zoom
                </div>
              </div>
            )}
          </div>

          {/* Night mode - Enhanced for colorblind users */}
          <div
            className="nav-item"
            role="button"
            tabIndex={0}
            aria-pressed={isNightMode}
            aria-label={isNightMode ? t.lightMode : t.darkMode}
            onClick={toggleNightMode}
            onKeyDown={(e) => handleKeyActivate(e, toggleNightMode)}
          >
            <img
              src={isNightMode ? nightModeIcon : brightModeIcon}
              alt=""
              className="nav-icon"
              aria-hidden="true"
            />
            <span className="nav-label">
              {isNightMode ? "🌙 " + t.lightMode : "☀️ " + t.darkMode}
            </span>
          </div>

          {/* Account */}
          <div
            className="nav-item account-dropdown-toggle"
            role="button"
            tabIndex={0}
            aria-haspopup="true"
            aria-expanded={isAccountDropdownOpen}
            onClick={() => setIsAccountDropdownOpen((s) => !s)}
            onKeyDown={(e) =>
              handleKeyActivate(e, () => setIsAccountDropdownOpen((s) => !s))
            }
          >
            <img src={accountIcon} alt="" className="nav-icon" aria-hidden="true" />
            <span className="nav-label">{t.account}</span>
            {isAccountDropdownOpen && (
              <div className="account-dropdown" role="menu" aria-label="Account options">
                <div
                  role="menuitem"
                  tabIndex={0}
                  onClick={() => navigate("/view-account")}
                  onKeyDown={(e) =>
                    handleKeyActivate(e, () => navigate("/view-account"))
                  }
                >
                  👤 View Account Info
                </div>
                <div
                  role="menuitem"
                  tabIndex={0}
                  onClick={() => navigate("/change-password")}
                  onKeyDown={(e) =>
                    handleKeyActivate(e, () => navigate("/change-password"))
                  }
                >
                  🔒 Change Password
                </div>
                <div
                  role="menuitem"
                  tabIndex={0}
                  onClick={() => navigate("/delete-account")}
                  onKeyDown={(e) =>
                    handleKeyActivate(e, () => navigate("/delete-account"))
                  }
                >
                  ⚠️ Delete My Account
                </div>
              </div>
            )}
          </div>

          {/* Logout */}
          <div
            className="nav-item logout"
            role="button"
            tabIndex={0}
            onClick={handleLogout}
            onKeyDown={(e) => handleKeyActivate(e, handleLogout)}
            aria-label={t.logout}
          >
            <img src={logoutIcon} alt="" className="nav-icon" aria-hidden="true" />
            <span className="nav-label">{t.logout}</span>
          </div>
        </nav>
      </header>

      {/* Main content with sidebar */}
      <div className="dashboard-body">
        <aside
          className={sidebarClass}
          aria-label="Primary features"
          aria-hidden={!sidebarOpen}
        >
          <ul>
            <li
              role="button"
              tabIndex={0}
              onClick={() => navigate("/text-to-speech")}
              onKeyDown={(e) =>
                handleKeyActivate(e, () => navigate("/text-to-speech"))
              }
            >
              <span className="icon" aria-hidden="true">
                🔊
              </span>
              <div className="content">
                <span className="title">Text to Speech</span>
                <span className="description">Convert text into audio</span>
              </div>
            </li>
            <li
              role="button"
              tabIndex={0}
              onClick={() => navigate("/speech-to-text")}
              onKeyDown={(e) =>
                handleKeyActivate(e, () => navigate("/speech-to-text"))
              }
            >
              <span className="icon" aria-hidden="true">
                🎤
              </span>
              <div className="content">
                <span className="title">Speech to Text</span>
                <span className="description">Convert audio to text</span>
              </div>
            </li>
            <li
              role="button"
              tabIndex={0}
              onClick={() =>
                window.open(
                  "https://accessibility-bot-multilang.vercel.app/",
                  "_blank"
                )
              }
              onKeyDown={(e) =>
                handleKeyActivate(e, () =>
                  window.open(
                    "https://accessibility-bot-multilang.vercel.app/",
                    "_blank"
                  )
                )
              }
            >
              <span className="icon" aria-hidden="true">
                🌐
              </span>
              <div className="content">
                <span className="title">MultiLanguage</span>
                <span className="description">Translate content</span>
              </div>
            </li>
            <li
              role="button"
              tabIndex={0}
              onClick={() => navigate("/image-to-text")}
              onKeyDown={(e) =>
                handleKeyActivate(e, () => navigate("/image-to-text"))
              }
            >
              <span className="icon" aria-hidden="true">
                🖼️
              </span>
              <div className="content">
                <span className="title">Image to Text</span>
                <span className="description">Extract text from images</span>
              </div>
            </li>
                        <li
              role="button"
              tabIndex={0}
              onClick={() => navigate("/PDF-to-text")}
              onKeyDown={(e) =>
                handleKeyActivate(e, () => navigate("/PDF-to-text"))
              }
            >
              <span className="icon" aria-hidden="true">
                <i className="fa-solid fa-file-pdf" aria-hidden="true" />
              </span>
              <div className="content">
                <span className="title">PDF to Text</span>
                <span className="description">Extract text from PDF file</span>
              </div>
            </li>
            <li
              role="button"
              tabIndex={0}
              onClick={() =>
                window.open(
                  "https://accessibility-bot-text-summarize.vercel.app/",
                  "_blank"
                )
              }
              onKeyDown={(e) =>
                handleKeyActivate(e, () =>
                  window.open(
                    "https://accessibility-bot-text-summarize.vercel.app/",
                    "_blank"
                  )
                )
              }
            >
              <span className="icon" aria-hidden="true">
                📝
              </span>
              <div className="content">
                <span className="title">Summarize Text</span>
                <span className="description">Get concise summaries</span>
              </div>
            </li>
            <li
              role="button"
              tabIndex={0}
              onClick={() =>
                window.open(
                  "https://accessibility-bot-text-paraphrase.vercel.app/",
                  "_blank"
                )
              }
              onKeyDown={(e) =>
                handleKeyActivate(e, () =>
                  window.open(
                    "https://accessibility-bot-text-paraphrase.vercel.app/",
                    "_blank"
                  )
                )
              }
            >
              <span className="icon" aria-hidden="true">
                ✍️
              </span>
              <div className="content">
                <span className="title">Paraphrase</span>
                <span className="description">Rewrite text clearly</span>
              </div>
            </li>
            <li
              role="button"
              tabIndex={0}
              onClick={() =>
                window.open(
                  "https://accessibility-bot-interactive-dictionary.vercel.app/",
                  "_blank"
                )
              }
              onKeyDown={(e) =>
                handleKeyActivate(e, () =>
                  window.open(
                    "https://accessibility-bot-interactive-dictionary.vercel.app/",
                    "_blank"
                  )
                )
              }
            >
              <span className="icon" aria-hidden="true">
                📚
              </span>
              <div className="content">
                <span className="title">Dictionary</span>
                <span className="description">Look up definitions</span>
              </div>
            </li>
            <li
              role="button"
              tabIndex={0}
              onClick={() => navigate("/keyboardshortcuts")}
              onKeyDown={(e) =>
                handleKeyActivate(e, () => navigate("/keyboardshortcuts"))
              }
            >
              <span className="icon" aria-hidden="true">
                ⌨️
              </span>
              <div className="content">
                <span className="title">Keyboard Shortcuts</span>
                <span className="description">View all shortcuts</span>
              </div>
            </li>
          </ul>
        </aside>

        <main className="main-chat">
          <h2 className="visually-hidden">Chat with the accessibility bot</h2>

          {error && (
            <div className="error-message" role="alert">
              ⚠️ {error}
            </div>
          )}

          <section className="chat-area">
            {chatHistory?.length === 0 && (
              <p className="welcome-text">{t.welcomeMessage}</p>
            )}

            <div className="bot-image-wrapper">
              {/* <img src={botImage} alt="Bot illustration" className="bot-image" /> */}
            </div>

            {chatHistory?.length > 0 && (
              <div
                className="chat-history"
                role="log"
                aria-live="polite"
                aria-atomic="false"
              >
                {chatHistory.map((m) => (
                  <div key={m.id} className={`chat-msg ${m.sender}`}>
                    <div className="chat-msg-content">
                      {m.sender === "user" ? "👤 " : "🤖 "}
                      {m.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="chat-msg bot">
                    <div className="chat-msg-content">
                      <span className="loading-indicator" aria-label="Loading"></span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Chat input */}
          <div className="chat-input-box-container">
            <form
              className="chat-input-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <input
                type="text"
                placeholder={t.messagePlaceholder}
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                aria-label="Message input"
                disabled={isLoading}
              />
              <button
                type="button"
                className={`icon-btn voice-btn ${isRecording ? "recording" : ""}`}
                onClick={handleVoiceInputToggle}
                aria-pressed={isRecording}
                aria-label={isRecording ? "Stop recording" : "Start voice input"}
                disabled={isLoading}
              >
                <img src={voiceIcon} alt="" aria-hidden="true" />
              </button>
              <button
                type="submit"
                className="icon-btn send-btn"
                aria-label="Send message"
                disabled={isLoading || !chatMessage.trim()}
              >
                <img src={sendIcon} alt="" aria-hidden="true" />
              </button>
            </form>
            {isRecording && (
              <p className="sr-recording" role="status" aria-live="assertive">
                {t.recording}
              </p>
            )}
          </div>
        </main>
      </div>

      <div
        ref={srLiveRef}
        className="visually-hidden"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />
    </div>
  );
}
