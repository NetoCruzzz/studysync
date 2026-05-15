import React, { useEffect, useState } from 'react';
import './App.css';
import { apiFetch } from './api';

function Tasks() {
  const savedUser = JSON.parse(window.localStorage.getItem('studysync_user') || 'null');
  const userId = savedUser?._id || '';

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const loadTasks = async () => {
      const { response, data } = await apiFetch('/api/tasks');
      if (response.ok && Array.isArray(data)) {
        const mine = userId ? data.filter((t) => String(t.user) === String(userId)) : data;
        setTasks(mine);
      }
    };
    loadTasks();
  }, [userId]);

  const handleAddTask = async () => {
    const title = newTask.trim();
    if (!title) return;

    const { response, data } = await apiFetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, user: userId || undefined })
    });
    if (response.ok) {
      setTasks((prev) => [...prev, data]);
      setNewTask('');
    }
  };

  const handleDelete = async (id) => {
    const { response } = await apiFetch(`/api/tasks/${id}`, { method: 'DELETE' });
    if (response.ok) {
      setTasks((prev) => prev.filter((t) => t._id !== id));
    }
  };

  const handleToggle = async (id) => {
    const task = tasks.find((t) => t._id === id);
    if (!task) return;
    const { response, data } = await apiFetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !task.completed })
    });
    if (response.ok) {
      setTasks((prev) => prev.map((t) => (t._id === id ? data : t)));
    }
  };

  const handleEdit = (id) => {
    const task = tasks.find((t) => t._id === id);
    if (!task) return;
    setNewTask(task.title);
    setEditId(id);
  };

  const handleSaveEdit = async () => {
    const title = newTask.trim();
    if (!title || !editId) return;
    const { response, data } = await apiFetch(`/api/tasks/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    if (response.ok) {
      setTasks((prev) => prev.map((t) => (t._id === editId ? data : t)));
      setEditId(null);
      setNewTask('');
    }
  };

  return (
    <div>
      <h2>Task Manager</h2>

      <input
        className="login-input"
        placeholder="Enter task..."
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />

      {editId === null ? (
        <button className="login-button" onClick={handleAddTask}>
          Add Task
        </button>
      ) : (
        <button className="login-button" onClick={handleSaveEdit}>
          Save Edit
        </button>
      )}

      <hr className="divider" />

      {tasks.length === 0 ? (
        <div className="empty-state">No tasks yet. Add your first task.</div>
      ) : (
        tasks.map((task) => (
          <div key={task._id} className="task-row">
            <span className={`task-text ${task.completed ? 'completed' : ''}`}>
              {task.title}
            </span>

            <div>
              <button className="task-btn" onClick={() => handleToggle(task._id)}>
                {task.completed ? 'Undo' : 'Done'}
              </button>
              <button className="task-btn" onClick={() => handleEdit(task._id)}>
                ✏️
              </button>
              <button className="task-btn delete" onClick={() => handleDelete(task._id)}>
                ✖
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Tasks;
