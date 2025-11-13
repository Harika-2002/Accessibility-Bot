import React, { useEffect, useState } from 'react';
import './ViewAccountInfo.css';

function ViewAccountInfo(props) {
	const [userId, setUserId] = useState('');
	const [email, setEmail] = useState('');
	const [name, setName] = useState('');
	const [status, setStatus] = useState(''); // ✅ new: track status message

	useEffect(() => {
		const sid = sessionStorage.getItem('userId') || sessionStorage.getItem('user_id') || '';
		if (sid) setUserId(sid);

		const sessUsername = sessionStorage.getItem('username') || sessionStorage.getItem('userName') || sessionStorage.getItem('name') || '';
		if (sessUsername) setName(sessUsername);

		const sessEmail = sessionStorage.getItem('email') || '';
		if (sessEmail) setEmail(sessEmail);
	}, []);

	const handleUpdate = (e) => {
		e.preventDefault();

		// Example of mock update logic:
		if (email && name) {
			// success case
			setStatus('✅ Account updated successfully');
		} else {
			// error case
			setStatus('❌ Please fill out all required fields');
		}
	};

	return (
		<div className="view-account page-content">
			<div className="account-info-container">
				<h2 id="account-title" className="account-title">View and update account information</h2>

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

					<button type="submit">Update Account</button>

					<div
						role="status"
						aria-live="polite"
						className={`feedback ${status.includes('✅') ? 'success' : status.includes('❌') ? 'error' : ''}`}
					>
						{status}
					</div>
				</form>
			</div>
		</div>
	);
}

export default ViewAccountInfo;