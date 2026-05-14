import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Tasks from './Tasks';
import './App.css';
import { apiFetch } from './api';

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const savedUser = JSON.parse(window.localStorage.getItem('studysync_user') || 'null');
  const user = location.state || savedUser || { username: 'Guest', email: '' };
  const currentUserId = user._id || '';

  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const loadGroups = async () => {
      const { response, data } = await apiFetch('/api/groups');
      if (response.ok && Array.isArray(data)) {
        setGroups(data);
      }
    };
    loadGroups();
  }, []);

  const joinedGroups = useMemo(
    () =>
      groups.filter((group) =>
        (group.members || []).some((m) => (m._id || m) === currentUserId)
      ),
    [groups, currentUserId]
  );

  const recentActivity = useMemo(() => {
    return joinedGroups
      .flatMap((group) =>
        (group.activity || []).map((item, idx) => ({
          ...item,
          groupName: group.name,
          id: item._id || idx
        }))
      )
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
      .slice(0, 3);
  }, [joinedGroups]);

  const handleLogout = () => {
    window.localStorage.removeItem('studysync_token');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1>Dashboard</h1>

        {user && (
          <>
            <p><strong>Username:</strong> {user.username}</p>
            {user.email && <p><strong>Email:</strong> {user.email}</p>}
          </>
        )}

        <div className="dashboard-summary">
          <div className="dashboard-stat">
            <strong>{joinedGroups.length}</strong>
            <span>Groups joined</span>
          </div>
          <div className="dashboard-stat">
            <strong>{recentActivity.length}</strong>
            <span>Recent group posts</span>
          </div>
        </div>

        {joinedGroups.length > 0 && (
          <div className="dashboard-mini-card">
            <h3>My groups</h3>
            <div className="group-chip-row">
              {joinedGroups.map((group) => (
                <span key={group._id} className="group-chip">
                  {group.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {recentActivity.length > 0 && (
          <div className="dashboard-mini-card">
            <h3>Recent activity</h3>
            {recentActivity.map((item) => (
              <div key={`${item.groupName}-${item.id}`} className="activity-row">
                <strong>{item.author}</strong> in <em>{item.groupName}</em>: {item.text}
              </div>
            ))}
          </div>
        )}

        <button
          className="login-button secondary-btn"
          onClick={() => navigate('/profile', { state: user })}
        >
          Edit Profile
        </button>

        <hr className="divider" />

        <Tasks />

        <div className="dashboard-actions">
          <Link className="nav-button" to="/feed">
            Go to Social Feed
          </Link>
          <Link className="nav-button" to="/groups">
            Go to Groups
          </Link>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
