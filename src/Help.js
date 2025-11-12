import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth"; // Firebase auth
import { db } from "./firebase"; // Firestore database
import { collection, addDoc } from "firebase/firestore"; // Firestore methods
import "./Help.css";
 
const HelpPage = () => {
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]); // Chat history to store messages
  const [feedback, setFeedback] = useState("");
  const [submittedFeedback, setSubmittedFeedback] = useState(false);
  const [username, setUsername] = useState(""); // User's email
  const [error, setError] = useState(null); // Error tracking
  const [rating, setRating] = useState(0); // Star rating
 
  // Fetch authenticated user's email
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
 
    if (user) {
      setUsername(user.email); // Set username to the user's email
    } else {
      setUsername("Anonymous"); // For non-authenticated users
    }
  }, []);
 
  // Define rule-based responses
  const getBotResponse = (message) => {
    const lowercasedMessage = message.toLowerCase();
 
    // Define rules based on common questions, requests, and website features
    if (
      lowercasedMessage.includes("hi") ||
      lowercasedMessage.includes("hello")
    ) {
      return "Hello! How can I assist you today?";
    } else if (lowercasedMessage.includes("how are you")) {
      return "I'm just a bot, but I'm here to help! How can I assist you?";
    } else if (
      lowercasedMessage.includes("change") &&
      lowercasedMessage.includes("password")
    ) {
      return "To change your password, go to Your Account section and select 'Change Password'.";
    } else if (lowercasedMessage.includes("keyboard shortcuts")) {
      return "You can ask the bot or use Ctrl+K for a list of keyboard shortcuts.";
    } else if (lowercasedMessage.includes("dark mode")) {
      return "To enable dark mode, click the 'Night Mode' button in the top navigation bar.";
    } else if (
      lowercasedMessage.includes("delete") &&
      lowercasedMessage.includes("account")
    ) {
      return "To delete your account, go to Your Account section, select 'Delete Account', and follow the instructions.";
    } else if (
      lowercasedMessage.includes("reset") &&
      lowercasedMessage.includes("password")
    ) {
      return "To reset your password, click 'Forgot Your Password?' on the login page and follow the instructions.";
    } else if (lowercasedMessage.includes("feedback")) {
      return "You can submit feedback using the form on the Help page. Just scroll down to the feedback section.";
    } else if (lowercasedMessage.includes("bug")) {
      return "If you're experiencing a bug, please submit the details through the feedback form. We'll review it as soon as possible.";
    } else if (lowercasedMessage.includes("navigate")) {
      return "You can navigate to different sections using the sidebar on the left. Options include 'Text to Speech', and more.";
    } else if (lowercasedMessage.includes("account creation")) {
      return "To create an account, go to the signup page and fill out the required fields.";
    } else if (
      lowercasedMessage.includes("log out") ||
      lowercasedMessage.includes("logout")
    ) {
      return "To log out, click the 'Logout' button in the user menu in the top right corner.";
    } else if (lowercasedMessage.includes("account info")) {
      return "To update your profile, go to the View Account Info in the 'Your Account' section and make the necessary changes.";
    } else if (lowercasedMessage.includes("support")) {
      return "You can contact our support team at accessibilitybotteam@gmail.com for further assistance.";
    } else if (lowercasedMessage.includes("upload")) {
      return "To upload a file, navigate to the 'Upload' section, select your file, and click 'Submit'.";
    } else if (lowercasedMessage.includes("faq")) {
      return "You can find answers to common questions in the FAQ section of the Help page.";
    } else if (
      lowercasedMessage.includes("problem") ||
      lowercasedMessage.includes("issue")
    ) {
      return "Please describe your problem in detail so that we can help you.";
    } else {
      return "I'm sorry, I don't understand your question. Could you please rephrase?";
    }
  };
 
  // Handle chat message submission and save chat to Firestore
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    
    // Check if message is empty
    const trimmedMessage = chatMessage.trim();
    if (!trimmedMessage) return;
 
    // Add the user's message to the chat history
    const userMessage = { sender: "user", text: trimmedMessage };
    const botResponse = { sender: "bot", text: getBotResponse(trimmedMessage) };
 
    // Update chat history locally
    const newChatHistory = [...chatHistory, userMessage, botResponse];
    setChatHistory(newChatHistory);
 
    // Save chat history to Firestore
    try {
      await addDoc(collection(db, "chatHistory"), {
        username: username,
        chat: newChatHistory,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error saving chat to Firestore: ", error);
    }
 
    // Clear input field
    setChatMessage("");
  };
 
  // Feedback submission handler
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) return; // Don't submit empty feedback
    
    try {
      // Submit feedback to Firestore, including star rating
      await addDoc(collection(db, "feedbacks"), {
        username: username, // User email from Firebase Auth
        feedback: feedback,
        rating: rating, // Save star rating
        timestamp: new Date(), // Timestamp
      });
      setSubmittedFeedback(true);
      setFeedback(""); // Clear feedback field after submitting
      setRating(0); // Reset rating after submission
    } catch (error) {
      console.error("Error submitting feedback: ", error);
      setError(
        "There was an issue submitting your feedback. Please try again."
      );
    }
  };
 
  // Handle star rating click
  const handleStarClick = (newRating) => {
    setRating(newRating);
  };
 
  return (
    <div className="help-container">
      <h1>Help & Support</h1>
 
      {/* FAQ Section */}
      <main>
        <div className="help-box faq-section">
          <h2>Frequently Asked Questions (FAQ)</h2>
          <h2>1. How to change your password?</h2>
          <p className="faq-answer">Go to Your Account Section</p>
 
          <h2>2. Where do we get a list of Keyboard Shortcuts?</h2>
          <p className="faq-answer">You can just ask the bot or use Ctrl+K</p>
 
          <h2>3. How to enable dark mode?</h2>
          <p className="faq-answer">
            Click on the "Night Mode" button in the top navigation bar.
          </p>
        </div>
 
        {/* Chatbot Section */}
        <div className="help-box chatbot-section">
          <h3>Chat with Our Bot</h3>
 
          {/* Chat History */}
          <div className="chat-history">
            {chatHistory.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${
                  message.sender === "user" ? "user-message" : "bot-message"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>
 
          {/* Chat Input */}
          <form onSubmit={handleChatSubmit}>
            <textarea
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Type your message here"
              className="chat-input"
              aria-label="Type your message to the chatbot"
            />
            <button
              type="submit"
              className="chat-submit-btn"
              disabled={!chatMessage.trim()}
            >
              Send
            </button>
          </form>
        </div>
 
        {/* Feedback Form */}
        <div className="help-box feedback-section">
          <h3>Submit Your Feedback</h3>
          {!submittedFeedback ? (
            <form onSubmit={handleFeedbackSubmit}>
              <p>
                <strong>User:</strong> {username}
              </p>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="We value your feedback. Please share your thoughts."
                className="feedback-input"
                aria-label="We value your feedback. Please share your thoughts."
                required
              />
 
              {/* Star Rating */}
              <div className="star-rating">
                <p>Rate Us:</p>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    className={star <= rating ? "star filled" : "star"}
                    onClick={() => handleStarClick(star)}
                    aria-label={`${star} ${star > 1 ? 'stars' : 'star'} rating`}
                  >
                    &#9733; {/* Unicode for filled star */}
                  </button>
                ))}
              </div>
 
              <button
                type="submit"
                className="feedback-submit-btn"
                disabled={!feedback.trim()}
              >
                Submit Feedback
              </button>
            </form>
          ) : (
            <p className="thank-you-message">Thank you for your feedback!</p>
          )}
 
          {/* Error message if feedback fails */}
          {error && <p className="error-message">{error}</p>}
        </div>
 
        {/* Contact Support Section */}
        <div className="help-box contact-support-section">
          <h3>Contact Support</h3>
          <p>
            If you need further assistance, feel free to reach out to our
            support team:
          </p>
          <p>
            Email:{" "}
            <a href="mailto:accessibilitybotteam@gmail.com">
              <strong className="email-link">
                accessibilitybotteam@gmail.com
              </strong>
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};
 
export default HelpPage;
