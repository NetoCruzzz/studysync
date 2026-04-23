import React, { useEffect, useState } from 'react';
import './App.css';

const STORAGE_KEY = 'studysync_tasks';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setTasks(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 1800);
  };

  const saveTasks = (updatedTasks) => {
    setTasks(updatedTasks);
  };

  const handleAddTask = async () => {
    const text = newTask.trim();
    if (!text) {
      showMessage('Enter a task before adding.');
      return;
    }

    const task = {
      id: Date.now(),
      text,
      completed: false
    };

    saveTasks([task, ...tasks]);
    setNewTask('');
    showMessage('Task added.');

    try {
      await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      });
    } catch {
      // Backend may not be available; keep local fallback.
    }
  };

  const handleDelete = async (taskId) => {
    saveTasks(tasks.filter((task) => task.id !== taskId));
    showMessage('Task deleted.');

    try {
      await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'DELETE'
      });
    } catch {
      // Fallback mode.
    }
  };

  const handleToggle = async (taskId) => {
    const updated = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    saveTasks(updated);
    showMessage('Task status updated.');

    try {
      const toggledTask = updated.find((task) => task.id === taskId);
      await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: toggledTask.completed })
      });
    } catch {
      // Fallback mode.
    }
  };

  const handleEdit = (taskId) => {
    const task = tasks.find((item) => item.id === taskId);
    if (!task) return;

    setNewTask(task.text);
    setEditTaskId(taskId);
  };

  const handleSaveEdit = async () => {
    const text = newTask.trim();
    if (!text) {
      showMessage('Enter a task before saving.');
      return;
    }

    const updated = tasks.map((task) =>
      task.id === editTaskId ? { ...task, text } : task
    );

    saveTasks(updated);
    setEditTaskId(null);
    setNewTask('');
    showMessage('Task updated.');

    try {
      await fetch(`http://localhost:5000/api/tasks/${editTaskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
    } catch {
      // Fallback mode.
    }
  };

  const handleCancelEdit = () => {
    setEditTaskId(null);
    setNewTask('');
  };

  return (
    <div>
      <h2>Task Manager</h2>

      {message && <div className="message success">{message}</div>}

      <input
        className="login-input"
        placeholder="Enter task..."
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {editTaskId === null ? (
          <button className="login-button" onClick={handleAddTask}>
            Add Task
          </button>
        ) : (
          <>
            <button className="login-button" onClick={handleSaveEdit}>
              Save Edit
            </button>
            <button className="login-button secondary-btn" onClick={handleCancelEdit}>
              Cancel
            </button>
          </>
        )}
      </div>

      <hr className="divider" />

      {tasks.length === 0 ? (
        <div className="empty-state">No tasks yet. Add your first task.</div>
      ) : (
        tasks.map((task) => (
          <div key={task.id} className="task-row">
            <span className={`task-text ${task.completed ? 'completed' : ''}`}>
              {task.text}
            </span>

            <div>
              <button className="task-btn" onClick={() => handleToggle(task.id)}>
                {task.completed ? 'Undo' : 'Done'}
              </button>
              <button className="task-btn" onClick={() => handleEdit(task.id)}>
                ✏️
              </button>
              <button className="task-btn delete" onClick={() => handleDelete(task.id)}>
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