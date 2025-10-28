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
      // Reauthenticate the user with their current password
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      // Ensure reauthentication
      await reauthenticateWithCredential(user, credential);

      // Update the password
      await updatePassword(user, newPassword);
      setMessage("Password updated successfully!");
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
      <h1>Change Password</h1>
      {message && <p className="feedback">{message}</p>}
      <main>
        <form onSubmit={handlePasswordChange} className="change-password-form">
          <label>
            Current Password:
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </label>

          <label>
            New Password:
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </label>

          <label>
            Confirm New Password:
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit">Change Password</button>
        </form>
      </main>
    </div>
  );
};

export default ChangePassword;
