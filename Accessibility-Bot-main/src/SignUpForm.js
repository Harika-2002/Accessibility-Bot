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
  const [showPassword, setShowPassword] = useState(false);
  const [langAttrs, setLangAttrs] = useState({ dir: "ltr", lang: "en" });
  const [errors, setErrors] = useState({ userID: "", email: "", password: "" });
  const auth = getAuth(app);
  const db = getFirestore(app);
  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault();

    // Clear previous messages
    setMessage("");

    // Client-side per-field validation (inline + native bubble)
    const nextErrors = { userID: "", email: "", password: "" };
    if (!userid || !userid.trim()) nextErrors.userID = "Please fill out User ID";
    if (!email || !email.trim()) nextErrors.email = "Please fill out Email ID";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Please enter a valid email address.";
    if (!password || password.length === 0) nextErrors.password = "Please fill out Password";
    else if (password.length < 6) nextErrors.password = "Password must be at least 6 characters long.";

    setErrors(nextErrors);
    const firstErrorField = Object.keys(nextErrors).find((k) => nextErrors[k]);
    if (firstErrorField) {
      // focus the first invalid field and prevent submission
      const el = document.getElementById(firstErrorField === 'userID' ? 'userID' : firstErrorField);
      if (el && typeof el.focus === 'function') el.focus();
      return;
    }

    // Start loading
    setLoading(true);

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
  // Keep dir detection (for RTL) but set page lang to English to avoid
  // automatic browser translation popups when the UI is English.
  setLangAttrs({ dir: isRTL ? "rtl" : "ltr", lang: "en" });
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

          {message && (
            <p
              className="feedback"
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
            >
              {message}
            </p>
          )}

          <label htmlFor="userID">User ID</label>
          <input
            id="userID"
            name="userID"
            type="text"
            value={userid}
            onChange={(e) => {
              setUserID(e.target.value);
              // clear inline error while typing
              setErrors((prev) => ({ ...prev, userID: "" }));
              // clear native bubble
              e.target.setCustomValidity("");
            }}
            onInvalid={(e) => {
              // prevent default browser message and set custom text
              e.preventDefault();
              const msg = "Please fill out User ID";
              e.target.setCustomValidity(msg);
              setErrors((prev) => ({ ...prev, userID: msg }));
            }}
            onInput={(e) => {
              e.target.setCustomValidity("");
            }}
            placeholder="User ID"
            autoComplete="username"
            required
            aria-describedby={errors.userID ? "userID-error" : undefined}
          />
          {errors.userID && (
            <div id="userID-error" className="field-error" role="alert">
              {errors.userID}
            </div>
          )}

          <label htmlFor="email">Email ID</label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: "" }));
              e.target.setCustomValidity("");
            }}
            onInvalid={(e) => {
              e.preventDefault();
              const msg = e.target.validity.typeMismatch ? "Please enter a valid email address." : "Please fill out Email ID";
              e.target.setCustomValidity(msg);
              setErrors((prev) => ({ ...prev, email: msg }));
            }}
            onInput={(e) => {
              e.target.setCustomValidity("");
            }}
            placeholder="Email ID"
            autoComplete="email"
            required
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <div id="email-error" className="field-error" role="alert">
              {errors.email}
            </div>
          )}

          <label htmlFor="password">Create Password</label>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: "" }));
              e.target.setCustomValidity("");
            }}
            onInvalid={(e) => {
              e.preventDefault();
              const val = e.target.value || "";
              const msg = val.length === 0 ? "Please fill out Password" : "Password must be at least 6 characters long.";
              e.target.setCustomValidity(msg);
              setErrors((prev) => ({ ...prev, password: msg }));
            }}
            onInput={(e) => {
              e.target.setCustomValidity("");
            }}
            placeholder="Create Password"
            autoComplete="new-password"
            required
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          {errors.password && (
            <div id="password-error" className="field-error" role="alert">
              {errors.password}
            </div>
          )}

          <div className="show-password">
            <input
              id="showPassword"
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
            />
            <label htmlFor="showPassword">Show password</label>
          </div>

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
