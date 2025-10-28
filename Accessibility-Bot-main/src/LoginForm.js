import React, { useState } from "react";
import "./style.css";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { app } from "./firebase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const LoginForm = ({ isNightMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state
  const auth = getAuth(app);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true); // Start loading
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Logged in user:", userCredential.user);
      alert("Login successful! Redirecting to dashboard...");
      setLoading(false); // Stop loading
      localStorage.setItem("isLoggedIn", "true"); // Persist login state
      navigate("/dashboard");
    } catch (error) {
      alert(`Failed to login: ${error.message}`);
      setLoading(false); // Stop loading
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email address to reset your password.");
      return;
    }
    setLoading(true); // Start loading
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent! Please check your inbox.");
      setLoading(false); // Stop loading
    } catch (error) {
      alert(`Error: ${error.message}`);
      setLoading(false); // Stop loading
    }
  };

  return (
    <main>
      <div
        className={`signup-container ${
          isNightMode ? "night-mode" : "bright-mode"
        }`}
      >
        <h1 className="website-title">ACCESSIBILITY BOT</h1>{" "}
        {/* Website title above form */}
        <form
          className={`signup-form ${
            isNightMode ? "night-mode" : "bright-mode"
          }`}
          onSubmit={handleLogin}
        >
          <h2>Enter your details to Login</h2>

          <label htmlFor="email">Email ID</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email ID"
            required
          />

          <label htmlFor="password">Enter Your Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Your Password"
            required
          />

          <button type="submit" disabled={loading}>
            {" "}
            {/* Disable button when loading */}
            {loading ? "Logging in..." : "LOG IN"}
          </button>

          <p
            className="forgot-password"
            onClick={handleForgotPassword}
            style={{ cursor: "pointer" }}
          >
            Forgot Your Password?
          </p>

          <p>
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </p>
        </form>
      </div>
    </main>
  );
};

export default LoginForm;
