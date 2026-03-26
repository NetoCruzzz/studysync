import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './App.css';

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state;

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1>Dashboard</h1>

        {user ? (
          <p>Welcome, {user.email} 🎯</p>
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