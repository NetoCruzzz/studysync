import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { apiFetch } from './api';

function Groups() {
  const navigate = useNavigate();
  const savedUser = JSON.parse(window.localStorage.getItem('studysync_user') || 'null');
  const currentUser = savedUser?.username || 'You';
  const currentUserId = savedUser?._id || savedUser?.id || '';

  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [joinGroupName, setJoinGroupName] = useState('');
  const [activityText, setActivityText] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      const { response, data } = await apiFetch('/api/groups');
      if (response.ok) {
        setGroups(data);
        if (data.length) setSelectedGroupId(data[0]._id);
      } else {
        setError('Failed to load groups');
      }
      setLoading(false);
    };
    fetchGroups();
  }, []);

  const selectedGroup = groups.find((group) => group._id === selectedGroupId);
  const isMember = selectedGroup?.members.some((m) => (m._id || m) === currentUserId);

  const allGroupActivity = useMemo(() => {
    return groups
      .flatMap((group) =>
        (group.activity || []).map((activity, idx) => ({
          ...activity,
          groupName: group.name,
          id: activity._id || idx
        }))
      )
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  }, [groups]);

  const showStatus = (message) => {
    setStatus(message);
    setError('');
    setTimeout(() => setStatus(''), 1800);
  };

  const showError = (message) => {
    setError(message);
    setStatus('');
    setTimeout(() => setError(''), 1800);
  };

  const handleCreateGroup = async () => {
    const name = newGroupName.trim();
    const description = newGroupDescription.trim();
    if (!name || !description) {
      return showError('Please enter a group name and description.');
    }
    if (!currentUserId) {
      return showError('You must be logged in to create a group.');
    }
    const { response, data } = await apiFetch('/api/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, userId: currentUserId })
    });
    if (response.ok) {
      setGroups((prev) => [data, ...prev]);
      setSelectedGroupId(data._id);
      setNewGroupName('');
      setNewGroupDescription('');
      showStatus(`Group "${name}" created.`);
    } else {
      showError(data?.error || 'Failed to create group.');
    }
  };

  const handleJoinGroup = async () => {
    const targetName = joinGroupName.trim();
    if (!targetName) {
      return showError('Enter a group name to join.');
    }
    if (!currentUserId) {
      return showError('You must be logged in to join a group.');
    }
    const group = groups.find((g) => g.name.toLowerCase() === targetName.toLowerCase());
    if (!group) {
      return showError('Group not found.');
    }
    if (group.members.some((m) => (m._id || m) === currentUserId)) {
      return showError('You are already a member of this group.');
    }
    const { response, data } = await apiFetch(`/api/groups/${group._id}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUserId })
    });
    if (response.ok) {
      setGroups((prev) => prev.map((g) => (g._id === group._id ? data : g)));
      setSelectedGroupId(group._id);
      setJoinGroupName('');
      showStatus(`Joined "${group.name}".`);
    } else {
      showError(data?.error || 'Failed to join group.');
    }
  };

  const handleLeaveGroup = async () => {
    if (!selectedGroup || !isMember) {
      return showError('You are not a member of this group.');
    }
    // For demo: just remove user from group members and update activity
    // Ideally, implement a backend route for leaving a group
    const updatedMembers = selectedGroup.members.filter((m) => (m._id || m) !== currentUserId);
    const updatedActivity = [
      ...selectedGroup.activity,
      {
        author: currentUser,
        text: 'Left the group.',
        date: new Date().toISOString()
      }
    ];
    setGroups((prev) =>
      prev.map((group) =>
        group._id === selectedGroup._id
          ? { ...group, members: updatedMembers, activity: updatedActivity }
          : group
      )
    );
    showStatus(`Left "${selectedGroup.name}".`);
  };

  const handleAddActivity = async () => {
    const text = activityText.trim();
    if (!selectedGroup || !text) {
      return showError('Type a message before posting.');
    }
    const { response, data } = await apiFetch(`/api/groups/${selectedGroup._id}/activity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author: currentUser, text })
    });
    if (response.ok) {
      setGroups((prev) =>
        prev.map((group) =>
          group._id === selectedGroup._id
            ? { ...group, activity: [...group.activity, data] }
            : group
        )
      );
      setActivityText('');
      showStatus('Group activity shared.');
    } else {
      showError(data?.error || 'Failed to post activity.');
    }
  };

  return (
    <div className="groups-container">
      <div className="groups-card">
        <div className="feed-header">
          <button className="nav-button" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
          <h1>Accountability Groups</h1>
        </div>

        {status && <div className="message success">{status}</div>}
        {error && <div className="message error">{error}</div>}
        {loading ? (
          <div>Loading groups...</div>
        ) : (
          <div className="groups-layout">
            <div className="groups-sidebar">
              <h3>Available Groups</h3>
              {groups.map((group) => (
                <div
                  key={group._id}
                  className={`group-item ${group._id === selectedGroupId ? 'group-selected' : ''}`}
                  onClick={() => setSelectedGroupId(group._id)}
                >
                  <strong>{group.name}</strong>
                  <p>{group.description}</p>
                  <small>
                    {group.members.length} members
                    {group.members.some((m) => (m._id || m) === currentUserId) ? ' · Joined' : ''}
                  </small>
                </div>
              ))}
            </div>

            <div className="groups-detail">
              <div className="group-actions">
                <div>
                  <h3>Create a group</h3>
                  <input
                    className="login-input"
                    value={newGroupName}
                    placeholder="Group name"
                    onChange={(e) => setNewGroupName(e.target.value)}
                  />
                  <input
                    className="login-input"
                    value={newGroupDescription}
                    placeholder="Group description"
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                  />
                  <button className="login-button" onClick={handleCreateGroup}>
                    Create Group
                  </button>
                </div>

                <div>
                  <h3>Join a group</h3>
                  <input
                    className="login-input"
                    value={joinGroupName}
                    placeholder="Existing group name"
                    onChange={(e) => setJoinGroupName(e.target.value)}
                  />
                  <button className="login-button secondary-btn" onClick={handleJoinGroup}>
                    Join Group
                  </button>
                </div>
              </div>

              {selectedGroup ? (
                <>
                  <div className="group-feed">
                    <div className="group-feed-header">
                      <h2>{selectedGroup.name}</h2>
                      <button
                        className="login-button secondary-btn"
                        onClick={handleLeaveGroup}
                        disabled={!isMember}
                      >
                        {isMember ? 'Leave Group' : 'Not a member'}
                      </button>
                    </div>
                    <p>{selectedGroup.description}</p>
                    <p>
                      <strong>Members:</strong> {selectedGroup.members.map((m) => m.username || m).join(', ')}
                    </p>

                    <div className="new-post-section">
                      <textarea
                        className="login-input"
                        rows="3"
                        value={activityText}
                        placeholder="Share group progress or plans..."
                        onChange={(e) => setActivityText(e.target.value)}
                      />
                      <button className="login-button" onClick={handleAddActivity}>
                        Post to group
                      </button>
                    </div>

                    <div className="activity-feed">
                      <h3>Group Activity</h3>
                      {(selectedGroup.activity?.length === 0 || !selectedGroup.activity) ? (
                        <div className="empty-state">No activity yet.</div>
                      ) : (
                        selectedGroup.activity.map((item, idx) => (
                          <div key={item._id || idx} className="feed-post">
                            <div className="post-header">
                              <strong>{item.author}</strong>
                              <span>{item.date ? new Date(item.date).toLocaleString() : ''}</span>
                            </div>
                            <p>{item.text}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="all-activity-panel">
                    <h3>All Groups Activity</h3>
                    {allGroupActivity.length === 0 ? (
                      <div className="empty-state">No activity across groups yet.</div>
                    ) : (
                      allGroupActivity.slice(0, 6).map((item) => (
                        <div key={`${item.groupName}-${item.id}`} className="feed-post">
                          <div className="post-header">
                            <strong>{item.author}</strong>
                            <span>{item.date ? new Date(item.date).toLocaleString() : ''}</span>
                          </div>
                          <p>{item.text}</p>
                          <small>in {item.groupName}</small>
                        </div>
                      ))
                    )}
                  </div>
                </>
              ) : (
                <div className="empty-state">Select a group to see details.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Groups;