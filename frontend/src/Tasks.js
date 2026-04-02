import React, { useState } from 'react';
import './App.css';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  const handleAddTask = () => {
    if (!newTask) return;
    setTasks([...tasks, { text: newTask, completed: false }]);
    setNewTask('');
  };

  const handleDelete = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleToggle = (index) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
  };

  const handleEdit = (index) => {
    setNewTask(tasks[index].text);
    setEditIndex(index);
  };

  const handleSaveEdit = () => {
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

      {tasks.length === 0 && <p>No tasks yet</p>}

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