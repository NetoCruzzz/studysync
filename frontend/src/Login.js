import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';


function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Login successful!');
        setMessageType('success');
        setTimeout(() => navigate('/dashboard'), 1500); // Delay navigation to show message
      } else {
        setMessage(data.error || data.message || 'Login failed');
        setMessageType('error');
      }
    } catch (err) {
      setMessage("Backend not connected — simulating login");
      setMessageType('error');
      setTimeout(() => navigate('/dashboard', { state: { username } }), 1500);
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
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="login-input"
          type="password"
          placeholder="Password"
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
     