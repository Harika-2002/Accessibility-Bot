import React, { useState, useRef, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import "./ChatBot.css";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef(null);

  const { transcript, resetTranscript } = useSpeechRecognition();

  // Monitor transcript for specific commands
  useEffect(() => {
    if (isListening) {
      handleVoiceCommands(transcript.toLowerCase());
    }
  }, [transcript, isListening, handleVoiceCommands]);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const startListening = () => {
    SpeechRecognition.startListening();
    setIsListening(true);
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setIsListening(false);
    resetTranscript(); // Clear transcript when stopping listening
  };

  const respond = (responseText) => {
    const newMessages = [
      ...messages,
      { text: responseText, sender: "bot" }
    ];
    setMessages(newMessages);
    scrollToBottom();
  };

  // Function to handle voice commands
  const handleVoiceCommands = (command) => {
    if (!command) return;
    let actionTaken = false; 
    // Website navigation commands
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
      vercel: "https://www.vercel.com"
    };

    const siteName = Object.keys(websiteMap).find((site) => command.includes(site));
    if (siteName && (command.includes("go to") || command.includes("navigate to") || command.includes("open"))) {
      const url = websiteMap[siteName];
      window.open(url, "_blank");
      respond(`Opening ${siteName}...`);
      return;
    }

    // App-specific navigation and actions
    if (command.includes("open help") || command.includes("navigate to help") || command.includes("take me to help")) {
      respond("Opening Help page...");
      navigateToPage("/help");

    }else if (command.includes("open home page")|| command.includes("navigate to home page")) {
      respond("Taking you to Account Info...");
      navigateToPage("/home");
    }
       else if (command.includes("view my account info")) {
      respond("Taking you to Account Info...");
      navigateToPage("/view-account");

    } else if (command.includes("change password") || command.includes("reset password")) {
      respond("Taking you to Change Password page...");
      navigateToPage("/change-password");

    } else if (command.includes("I want to delete my account") || command.includes("Take me to delete my account page")) {
      respond("Taking you to Delete account page...");
      navigateToPage("/delete-account");

    }else if (command.includes("logout") || command.includes("log out")) {
      respond("Logging out...");
      logout();

    } else if (command.includes("text to speech")) {
      respond("Navigating to Text to Speech...");
      navigateToPage("/text-to-speech");

    } else if (command.includes("speech to text")) {
      respond("Navigating to Speech to Text...");
      navigateToPage("/speech-to-text");

    } else if (command.includes("image to text")) {
      respond("Navigating to Image Text...");
      navigateToPage("/image-to-text");

    } 
    else if (command.includes("summarize the text")||command.includes("multi language translator")||command.includes("paraphrase the text")||command.includes("interactive dictionary")){
      const urls = {
        "multi-language": 'https://accessibilitybot-multilanguage.vercel.app/',
        "summarization": 'https://accessibilitybot-summarizethetext.vercel.app/',
        "paraphrasing": 'https://accessibilitybot-paraphrase.vercel.app/',
        "dictionary": 'https://accessibilitybot-intercativedictionary.vercel.app/'
    };
    window.open(urls[command.split(" ").find(key => urls[key])], '_blank');
    actionTaken = true; // External URL opened
    }else if (command.includes("zoom in")) {
      respond("Zooming in...");
      zoomIn();

    } else if (command.includes("zoom out")) {
      respond("Zooming out...");
      zoomOut();

    // Mode toggle command
    } else if (command.includes("toggle the mode")) {
      respond("Toggling display mode...");
      toggleMode();
    }
  };

  const handleSend = () => {
    if (input.trim()) {
      const newMessages = [...messages, { text: input, sender: "user" }];
      setMessages(newMessages);
      handleVoiceCommands(input.toLowerCase());
      setInput("");
    }
  };

  // Helper functions for each action
  const navigateToPage = (page) => {
    respond(`Navigating to ${page.replace("-", " ")} page...`);
    console.log(`Navigating to ${page}`);
    // Add actual navigation code here, e.g., using react-router
  };

  const zoomIn = () => {
    document.body.style.zoom = `${(parseFloat(document.body.style.zoom || 1) + 0.1)}`;
  };

  const zoomOut = () => {
    document.body.style.zoom = `${(parseFloat(document.body.style.zoom || 1) - 0.1)}`;
  };

  const toggleMode = () => {
    document.body.classList.toggle("dark-mode");
    respond("Display mode toggled.");
  };

  const logout = () => {
    respond("You have been logged out.");
    console.log("Logging out...");
    // Add actual logout logic here
  };

  return (
    <div className="container">
      <div className="chatBox">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <div className="inputContainer">
        <input
          type="text"
          placeholder="Enter your message here"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="input"
        />
        <button onClick={handleSend} className="sendButton">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="arrowIcon"
          >
            <path d="M2 12l18-10v20L2 12z" />
          </svg>
        </button>
        <button
          onClick={isListening ? stopListening : startListening}
          className={`voiceButton ${isListening ? "active" : ""}`}
        >
          🎤
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
