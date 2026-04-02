import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Tasks from './Tasks';
import './App.css';

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state;

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1>Dashboard</h1>

        {user && (
          <>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </>
        )}

        <button
          className="login-button secondary-btn"
          onClick={() => navigate('/profile', { state: user })}
        >
          Edit Profile
        </button>

        <hr className="divider" />

        <Tasks />

        <button className="logout-btn" onClick={() => navigate('/')}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;