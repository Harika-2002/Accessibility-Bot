import React from "react";
import { getAuth, deleteUser } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./DeleteAccount.css";

const DeleteAccount = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    if (user) {
      try {
        await deleteUser(user);
        alert("Account deleted successfully!");
        navigate("/signup");
      } catch (error) {
        alert(`Error deleting account: ${error.message}`);
      }
    } else {
      alert("No user logged in to delete");
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <div className="delete-account-container">
      <div className="delete-account-card">
        <h2>Are you sure you want to delete your account?</h2>
        <p className="warning-text">This action cannot be undone.</p>

        <div className="delete-account-buttons">
          <button className="cancel-button" onClick={handleCancel}>
            Cancel the Process
          </button>
          <button className="delete-button" onClick={handleDeleteAccount}>
            Yes, Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;
