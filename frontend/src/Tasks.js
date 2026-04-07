import React, { useState } from 'react';
import './App.css';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  const handleAddTask = async () => {
    if (!newTask) return;

    try {
      await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTask })
      });

      setTasks([...tasks, { text: newTask, completed: false }]);
      setNewTask('');
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (index) => {
    await fetch(`http://localhost:5000/api/tasks/${index}`, {
      method: 'DELETE'
    });

    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleToggle = async (index) => {
    await fetch(`http://localhost:5000/api/tasks/${index}`, {
      method: 'PUT'
    });

    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
  };

  const handleEdit = (index) => {
    setNewTask(tasks[index].text);
    setEditIndex(index);
  };

  const handleSaveEdit = async () => {
    await fetch(`http://localhost:5000/api/tasks/${editIndex}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newTask })
    });

    const updated = [...tasks];
    updated[editIndex].text = newTask;

    setTasks(updated);
    setEditIndex(null);
    setNewTask('');
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

      {editIndex === null ? (
        <button className="login-button" onClick={handleAddTask}>
          Add Task
        </button>
      ) : (
        <button className="login-button" onClick={handleSaveEdit}>
          Save Edit
        </button>
      )}

      <hr className="divider" />

      {tasks.map((task, i) => (
        <div key={i} className="task-row">
          <span className={`task-text ${task.completed ? 'completed' : ''}`}>
            {task.text}
          </span>

          <div>
            <button className="task-btn" onClick={() => handleToggle(i)}>✔</button>
            <button className="task-btn" onClick={() => handleEdit(i)}>✏️</button>
            <button className="task-btn delete" onClick={() => handleDelete(i)}>✖</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Tasks;