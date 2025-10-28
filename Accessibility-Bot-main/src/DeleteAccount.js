import React from "react";
import { getAuth, deleteUser } from "firebase/auth"; // Firebase auth for user deletion
import { useNavigate } from "react-router-dom"; // For navigation
import "./DeleteAccount.css"; // Assuming this contains the style you want to use

const DeleteAccount = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (user) {
      try {
        await deleteUser(user); // Delete the user from Firebase Auth
        alert("Account deleted successfully!");
        navigate("/signup"); // Redirect to signup after deletion
      } catch (error) {
        alert(`Error deleting account: ${error.message}`);
      }
    } else {
      alert("No user logged in to delete");
    }
  };

  // Cancel the process and go back to the dashboard
  const handleCancel = () => {
    navigate("/dashboard"); // Redirect back to the dashboard
  };

  return (
    <main>
      <div className="delete-account-container">
        <h1>Are you sure, you want to delete your account?</h1>
        <div className="delete-account-buttons">
          <button className="cancel-button" onClick={handleCancel}>
            Cancel the process
          </button>
          <button className="delete-button" onClick={handleDeleteAccount}>
            Yes, delete account
          </button>
        </div>
      </div>
    </main>
  );
};

export default DeleteAccount;
