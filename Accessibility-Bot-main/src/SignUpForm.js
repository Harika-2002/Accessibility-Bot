import React, { useState, useEffect } from "react";
import "./SignUpForm.css";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "./firebase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const SignUpForm = ({ isNightMode }) => {
  const [userid, setUserID] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [langAttrs, setLangAttrs] = useState({ dir: "ltr", lang: "en" });
  const auth = getAuth(app);
  const db = getFirestore(app);
  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault();

    // Start loading and clear previous messages
    setLoading(true);
    setMessage("");

    // Password validation
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        userid: userid,
        email: email,
      });

      setMessage("Registration successful! Redirecting to dashboard...");
      setUserID(""); // Clear form fields
      setEmail("");
      setPassword("");

      setTimeout(() => navigate("/dashboard"), 2000); // Redirect after a short delay
    } catch (error) {
      // Custom error messages based on error code
      if (error.code === "auth/email-already-in-use") {
        setMessage(
          "This email is already in use. Please try a different email."
        );
      } else if (error.code === "auth/weak-password") {
        setMessage("Password is too weak. Please choose a stronger password.");
      } else {
        setMessage(`Failed to register: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Detect user's preferred language and set dir/lang attributes.
  // Telugu (te) is LTR; Arabic/Hebrew/Persian/Urdu are RTL and will flip alignment.
  useEffect(() => {
    try {
      const nav = (navigator.languages && navigator.languages[0]) || navigator.language || "en";
      const navShort = nav.split("-")[0] || nav;
      const rtlLangs = ["ar", "he", "fa", "ur"];
      const isRTL = rtlLangs.includes(navShort.toLowerCase());
      setLangAttrs({ dir: isRTL ? "rtl" : "ltr", lang: nav });
    } catch (e) {
      // Fallback to LTR English if detection fails
      setLangAttrs({ dir: "ltr", lang: "en" });
    }
  }, []);

  return (
    <main>
      <div
        className={`signup-container ${
          isNightMode ? "night-mode" : "bright-mode"
        }`}
      >
        <header>
          <h1 className="website-title">ACCESSIBILITY BOT</h1>
        </header>

        <form
          className={`signup-form ${isNightMode ? "night-mode" : "bright-mode"}`}
          onSubmit={handleSignUp}
          dir={langAttrs.dir}
          lang={langAttrs.lang}
        >
          <h2>CREATE ACCOUNT</h2>

          {message && <p className="feedback">{message}</p>}

          <label htmlFor="userID">User ID</label>
          <input
            id="userID"
            type="text"
            value={userid}
            onChange={(e) => setUserID(e.target.value)}
            placeholder="User ID"
            required
          />

          <label htmlFor="email">Email ID</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email ID"
            required
          />

          <label htmlFor="password">Create Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create Password"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "SIGN UP"}
          </button>
          <p className="signup-footer">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </form>
      </div>
    </main>
  );
};

export default SignUpForm;
