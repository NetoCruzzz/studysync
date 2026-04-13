import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { apiFetch } from './api';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const saveUser = (userObject) => {
    window.localStorage.setItem('studysync_user', JSON.stringify(userObject));
  };

  const handleLogin = async () => {
    if (!username || !password) {
      setMessage('Please enter username and password.');
      setMessageType('error');
      return;
    }

    try {
      const { response: res, data } = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        const userObject = {
          username: data.username || username,
          email: data.email || ''
        };
        saveUser(userObject);
        setMessage('Login successful!');
        setMessageType('success');
        setTimeout(() => navigate('/dashboard', { state: userObject }), 700);
      } else {
        setMessage(data?.message || 'Login failed');
        setMessageType('error');
      }
    } catch (err) {
      const userObject = { username, email: '' };
      saveUser(userObject);
      setMessage('Backend not connected — simulating login');
      setMessageType('success');
      setTimeout(() => navigate('/dashboard', { state: userObject }), 1500);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>StudySync</h1>
        <h3>Login</h3>

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <input
          className="login-input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-button" onClick={handleLogin}>
          Login
        </button>
        <p style={{ marginTop: '10px' }}>
          Don’t have an account?{' '}
          <span
            style={{ color: '#4caf50', cursor: 'pointer' }}
            onClick={() => navigate('/register')}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
