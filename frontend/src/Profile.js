import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './App.css';

function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const savedUser = JSON.parse(window.localStorage.getItem('studysync_user') || 'null');
  const initialUser = location.state || savedUser || { username: '', email: '' };

  const [username, setUsername] = useState(initialUser.username || '');
  const [email, setEmail] = useState(initialUser.email || '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  useEffect(() => {
    if (savedUser) {
      setUsername(savedUser.username || '');
      setEmail(savedUser.email || '');
    }
  }, [savedUser]);

  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 2600);
  };

  const handleSave = () => {
    if (!username.trim()) {
      return showMessage('Username cannot be empty.', 'error');
    }

    const userObject = {
      username: username.trim(),
      email: email.trim()
    };

    window.localStorage.setItem('studysync_user', JSON.stringify(userObject));
    setPassword('');
    showMessage('Profile saved successfully.');
    navigate('/dashboard', { state: userObject });
  };

  const handleCancel = () => {
    navigate('/dashboard', { state: initialUser });
  };

  const handleDeleteAccount = () => {
    window.localStorage.removeItem('studysync_user');
    navigate('/', { replace: true });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="feed-header">
          <button className="nav-button secondary-btn" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
          <h1>Edit Profile</h1>
        </div>

        {message && <div className={`message ${messageType}`}>{message}</div>}

        <div className="profile-form">
          <label className="form-label">Username</label>
          <input
            className="login-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />

          <label className="form-label">Email</label>
          <input
            className="login-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />

          <label className="form-label">Password (optional)</label>
          <input
            className="login-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a new password"
          />
        </div>

        <div className="profile-actions">
          <button className="login-button" onClick={handleSave}>
            Save Changes
          </button>
          <button className="login-button secondary-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button className="task-btn delete" onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;