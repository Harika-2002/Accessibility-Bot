import React, { useEffect, useState } from 'react';
import './ViewAccountInfo.css';

function ViewAccountInfo(props) {
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [statusMessage, setStatusMessage] = useState(''); // ✅ Accessible status text
  const [isUpdating, setIsUpdating] = useState(false); // Optional loading state

  useEffect(() => {
    const sid = sessionStorage.getItem('userId') || sessionStorage.getItem('user_id') || '';
    if (sid) setUserId(sid);

    const sessUsername =
      sessionStorage.getItem('username') ||
      sessionStorage.getItem('userName') ||
      sessionStorage.getItem('name') ||
      '';
    if (sessUsername) setName(sessUsername);

    const sessEmail = sessionStorage.getItem('email') || '';
    if (sessEmail) setEmail(sessEmail);
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setStatusMessage('🔄 Updating your profile…'); // ✔ Clear text-based status

    try {
      // Simulate backend update
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStatusMessage('✅ Your account information has been updated successfully.');
    } catch (err) {
      setStatusMessage('❌ Update failed. Please try again.');
    }

    setIsUpdating(false);
  };

  return (
    <div className="view-account page-content">
      <div className="account-info-container">
        <h2 className="account-title">View and update account information</h2>

        <form className="account-info-form" onSubmit={handleUpdate} aria-labelledby="account-title">

          <label htmlFor="user-id">User ID</label>
          <input
            id="user-id"
            name="userId"
            type="text"
            value={userId}
            readOnly
            aria-readonly="true"
          />

          <label htmlFor="name">Username</label>
          <input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your username"
            aria-label="Username"
          />

          <label htmlFor="email">Email ID</label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />

          <button type="submit" disabled={isUpdating}>
            {isUpdating ? 'Updating…' : 'Update Account'}
          </button>

          {/* ✅ Accessible feedback (not color-dependent) */}
          <div
            role="status"
            aria-live="polite"
            className={`feedback ${
              statusMessage.includes('❌')
                ? 'error'
                : statusMessage.includes('✅')
                ? 'success'
                : ''
            }`}
          >
            {statusMessage}
          </div>

        </form>
      </div>
    </div>
  );
}

export default ViewAccountInfo;
