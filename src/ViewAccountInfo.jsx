import React, { useEffect, useState } from 'react';
import './ViewAccountInfo.css';

function ViewAccountInfo(props) {
	const [userId, setUserId] = useState('');
	const [email, setEmail] = useState('');
	const [name, setName] = useState('');

	useEffect(() => {
		// Try to fetch UserID from session storage (adjust key to match your auth code)
		const sid = sessionStorage.getItem('userId') || sessionStorage.getItem('user_id') || '';
		if (sid) setUserId(sid);

		// Try to retrieve username from session storage (multiple possible keys)
		const sessUsername = sessionStorage.getItem('username') || sessionStorage.getItem('userName') || sessionStorage.getItem('name') || '';
		if (sessUsername) setName(sessUsername);

		// Optionally fetch other user details from session or API
		const sessEmail = sessionStorage.getItem('email') || '';
		if (sessEmail) setEmail(sessEmail);
	}, []);

	const handleUpdate = (e) => {
		e.preventDefault();
		// ...existing update logic (send name/email changes to backend) ...
	};

	return (
		<div className="view-account page-content">
			<div className="account-info-container">
				<h2 className="account-title">View and update account information</h2>

				<form className="account-info-form" onSubmit={handleUpdate} aria-labelledby="account-title">
					{/* User ID: readonly, fetched from session */}
					<label htmlFor="user-id">User ID</label>
					<input
						id="user-id"
						name="userId"
						type="text"
						value={userId}
						readOnly
						aria-readonly="true"
					/>

					{/* Username field (editable, prefilled from session or API) */}
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

					{/* Email field */}
					<label htmlFor="email">Email ID</label>
					<input
						id="email"
						name="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="you@example.com"
					/>

					<button type="submit">Update Account</button>

					{/* feedback placeholder */}
					<div role="status" aria-live="polite" className="feedback" />
				</form>
			</div>
		</div>
	);
}

export default ViewAccountInfo;