import React, { useState, useEffect } from "react";
import { getAuth, updateEmail } from "firebase/auth"; // Import Firebase authentication functions
import { doc, getDoc, setDoc } from "firebase/firestore"; // Firestore functions
import { db } from "./firebase"; // Import Firestore database
import "./ViewAccountInfo.css";

const ViewAccountInfo = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      // Fetch user information from Firestore if it exists
      const fetchUserInfo = async () => {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setEmail(user.email); // Set email from Firebase authentication
          setUsername(userData.username || ""); // Set username from Firestore
        } else {
          console.log("No such document!");
        }
      };
      fetchUserInfo();
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Update email if it has been changed
      if (email !== user.email) {
        await updateEmail(user, email);
      }

      // Update the Firestore user information (name and username)
      await setDoc(
        doc(db, "users", user.uid),
        {
          username: username,
        },
        { merge: true }
      );

      setMessage("Account updated successfully!");
    } catch (error) {
      setMessage(`Error updating account: ${error.message}`);
    }
  };

  return (
    <div className="account-info-container">
      <h1>View and Update Account Information</h1>
      {message && <p className="feedback">{message}</p>}
      <main>
        <form onSubmit={handleUpdate} className="account-info-form">
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>

          <label>
            Email ID:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <button type="submit">Update Account</button>
        </form>
      </main>
    </div>
  );
};

export default ViewAccountInfo;
