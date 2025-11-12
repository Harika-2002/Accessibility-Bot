import React, { useState } from "react";
import {
  getAuth,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import "./ChangePassword.css";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const auth = getAuth();
  const user = auth.currentUser;

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!user) {
      setMessage("No user is logged in!");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match!");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setMessage("Password updated successfully!");

      // Clear form fields after success
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setMessage("Incorrect current password. Please try again.");
      } else if (error.code === "auth/invalid-credential") {
        setMessage("Invalid credential. Please try again.");
      } else {
        setMessage(`Error updating password: ${error.message}`);
      }
    }
  };

  return (
    <div className="change-password-container">
      <form onSubmit={handlePasswordChange} className="change-password-form">
        <h2>Change Password</h2>

        {message && (
          <p className="feedback" role="alert" aria-live="polite">
            {message}
          </p>
        )}

        <label htmlFor="current-password">Current Password</label>
        <input
          id="current-password"
          name="currentPassword"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current Password"
          autoComplete="current-password"
          required
        />

        <label htmlFor="new-password">New Password</label>
        <input
          id="new-password"
          name="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          autoComplete="new-password"
          required
        />

        <label htmlFor="confirm-password">Confirm New Password</label>
        <input
          id="confirm-password"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm New Password"
          autoComplete="new-password"
          required
        />

        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;
