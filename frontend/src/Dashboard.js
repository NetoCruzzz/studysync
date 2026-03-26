import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './App.css';

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = location.state;

  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleLogout = () => {
    navigate('/');
  };

  const handleSave = () => {
    setEditMode(false);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1>Dashboard</h1>

        {user ? (
          <>
            <h3>Profile</h3>

            {editMode ? (
              <>
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
                  Save
                </button>
              </>
            ) : (
              <>
                <p><strong>Username:</strong> {username}</p>
                <p><strong>Email:</strong> {email}</p>

                <button className="login-button" onClick={() => setEditMode(true)}>
                  Edit Profile
                </button>
              </>
            )}
          </>
        ) : (
          <p>No user data available</p>
        )}

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;