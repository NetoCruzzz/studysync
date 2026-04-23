import React, { useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Tasks from './Tasks';
import './App.css';

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const savedUser = JSON.parse(window.localStorage.getItem('studysync_user') || 'null');
  const user = location.state || savedUser || { username: 'Guest', email: '' };

  const groups = JSON.parse(window.localStorage.getItem('studysync_groups') || '[]');
  const joinedGroups = groups.filter((group) => group.members.includes(user.username));
  const recentActivity = useMemo(() => {
    return joinedGroups
      .flatMap((group) =>
        group.activity.map((item) => ({
          ...item,
          groupName: group.name
        }))
      )
      .sort((a, b) => b.id - a.id)
      .slice(0, 3);
  }, [joinedGroups]);

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

        <div className="dashboard-banner">
          <div>
            <strong>Quick group actions</strong>
            <p>Jump to group management to create, join, or review activity faster.</p>
          </div>
          <Link className="nav-button" to="/groups">
            Go to Groups
          </Link>
        </div>

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

        <div className="dashboard-mini-card">
          <h3>My accountability groups</h3>
          {joinedGroups.length === 0 ? (
            <div className="empty-state">
              You haven't joined any groups yet. Go to Groups to join or create one.
            </div>
          ) : (
            <div className="group-list">
              {joinedGroups.map((group) => (
                <div key={group.id} className="group-list-item">
                  <strong>{group.name}</strong>
                  <p>{group.description}</p>
                  <small>{group.members.length} members</small>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-mini-card">
          <h3>Recent group activity</h3>
          {recentActivity.length === 0 ? (
            <div className="empty-state">
              No recent activity in your joined groups yet.
            </div>
          ) : (
            recentActivity.map((item) => (
              <div key={item.id} className="activity-row">
                <strong>{item.author}</strong> in <em>{item.groupName}</em>: {item.text}
              </div>
            ))
          )}
        </div>

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

        <button className="logout-btn" onClick={() => navigate('/')}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;