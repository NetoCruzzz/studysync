import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './App.css';

function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state;

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = () => {
    navigate('/dashboard', {
      state: { username, email }
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Edit Profile</h2>

        <input
          className="login-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="login-button" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default Profile;