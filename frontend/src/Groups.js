import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const DEFAULT_GROUPS = [
  {
    id: 1,
    name: 'Math Masters',
    description: 'Weekly problem-solving study sessions.',
    members: ['Alex', 'Sofia'],
    activity: [
      { id: 101, author: 'Alex', text: 'Shared a geometry study guide.', time: '2h ago' },
      { id: 102, author: 'Sofia', text: 'Posted upcoming review quiz reminders.', time: '5h ago' }
    ]
  },
  {
    id: 2,
    name: 'Bio Buddies',
    description: 'Study group for biology and lab prep.',
    members: ['Mia'],
    activity: [
      { id: 201, author: 'Mia', text: 'Scheduled a live session for Saturday.', time: '1d ago' }
    ]
  }
];

const STORAGE_KEY = 'studysync_groups';
const USER_KEY = 'studysync_user';

function Groups() {
  const navigate = useNavigate();
  const savedUser = JSON.parse(window.localStorage.getItem(USER_KEY) || 'null');
  const currentUser = savedUser?.username || 'You';

  const [groups, setGroups] = useState(DEFAULT_GROUPS);
  const [selectedGroupId, setSelectedGroupId] = useState(DEFAULT_GROUPS[0].id);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [joinGroupName, setJoinGroupName] = useState('');
  const [activityText, setActivityText] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setGroups(parsed);
      if (parsed.length) {
        setSelectedGroupId(parsed[0].id);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
  }, [groups]);

  const selectedGroup = groups.find((group) => group.id === selectedGroupId);
  const isMember = selectedGroup?.members.includes(currentUser);

  const allGroupActivity = useMemo(() => {
    return groups
      .flatMap((group) =>
        group.activity.map((activity) => ({
          ...activity,
          groupName: group.name
        }))
      )
      .sort((a, b) => b.id - a.id);
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

  const handleCreateGroup = () => {
    const name = newGroupName.trim();
    const description = newGroupDescription.trim();

    if (!name || !description) {
      return showError('Please enter a group name and description.');
    }

    if (groups.some((group) => group.name.toLowerCase() === name.toLowerCase())) {
      return showError('That group name already exists.');
    }

    const newGroup = {
      id: Date.now(),
      name,
      description,
      members: [currentUser],
      activity: [
        {
          id: Date.now() + 1,
          author: currentUser,
          text: `Created the ${name} group.`,
          time: 'Just now'
        }
      ]
    };

    setGroups((prev) => [newGroup, ...prev]);
    setSelectedGroupId(newGroup.id);
    setNewGroupName('');
    setNewGroupDescription('');
    showStatus(`Group "${name}" created.`);
  };

  const handleJoinGroup = () => {
    const targetName = joinGroupName.trim();

    if (!targetName) {
      return showError('Enter a group name to join.');
    }

    const groupIndex = groups.findIndex(
      (group) => group.name.toLowerCase() === targetName.toLowerCase()
    );

    if (groupIndex === -1) {
      return showError('Group not found.');
    }

    const group = groups[groupIndex];
    if (group.members.includes(currentUser)) {
      return showError('You are already a member of this group.');
    }

    const updatedGroup = {
      ...group,
      members: [...group.members, currentUser],
      activity: [
        ...group.activity,
        {
          id: Date.now(),
          author: currentUser,
          text: 'Joined the group.',
          time: 'Just now'
        }
      ]
    };

    setGroups((prev) => [
      ...prev.slice(0, groupIndex),
      updatedGroup,
      ...prev.slice(groupIndex + 1)
    ]);
    setSelectedGroupId(group.id);
    setJoinGroupName('');
    showStatus(`Joined "${group.name}".`);
  };

  const handleLeaveGroup = () => {
    if (!selectedGroup || !isMember) {
      return showError('You are not a member of this group.');
    }

    const updatedGroup = {
      ...selectedGroup,
      members: selectedGroup.members.filter((member) => member !== currentUser),
      activity: [
        ...selectedGroup.activity,
        {
          id: Date.now(),
          author: currentUser,
          text: 'Left the group.',
          time: 'Just now'
        }
      ]
    };

    setGroups((prev) =>
      prev.map((group) => (group.id === selectedGroup.id ? updatedGroup : group))
    );
    showStatus(`Left "${selectedGroup.name}".`);
  };

  const handleAddActivity = () => {
    const text = activityText.trim();
    if (!selectedGroup || !text) {
      return showError('Type a message before posting.');
    }

    const updatedGroup = {
      ...selectedGroup,
      activity: [
        {
          id: Date.now(),
          author: currentUser,
          text,
          time: 'Just now'
        },
        ...selectedGroup.activity
      ]
    };

    setGroups((prev) =>
      prev.map((group) => (group.id === selectedGroup.id ? updatedGroup : group))
    );
    setActivityText('');
    showStatus('Group activity shared.');
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

        <div className="groups-layout">
          <div className="groups-sidebar">
            <h3>Available Groups</h3>
            {groups.map((group) => (
              <div
                key={group.id}
                className={`group-item ${group.id === selectedGroupId ? 'group-selected' : ''}`}
                onClick={() => setSelectedGroupId(group.id)}
              >
                <strong>{group.name}</strong>
                <p>{group.description}</p>
                <small>
                  {group.members.length} members
                  {group.members.includes(currentUser) ? ' · Joined' : ''}
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
                    <strong>Members:</strong> {selectedGroup.members.join(', ')}
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
                    {selectedGroup.activity.length === 0 ? (
                      <div className="empty-state">No activity yet.</div>
                    ) : (
                      selectedGroup.activity.map((item) => (
                        <div key={item.id} className="feed-post">
                          <div className="post-header">
                            <strong>{item.author}</strong>
                            <span>{item.time}</span>
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
                          <span>{item.time}</span>
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
      </div>
    </div>
  );
}

export default Groups;