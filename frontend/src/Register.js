import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleRegister = async () => {
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Registered successfully!');
        setMessageType('success');
        setTimeout(() => navigate('/'), 1500); // Delay navigation to show message
      } else {
        setMessage(data.message || 'Registration failed');
        setMessageType('error');
      }

    } catch (err) {
      console.log("Backend not running — fallback mode");

      // ✅ FALLBACK (so you’re not blocked)
      setMessage("Backend not connected — simulating registration");
      setMessageType('error');
      setTimeout(() => navigate('/dashboard', { state: { username, email } }), 1500);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>StudySync</h1>
        <h3>Register</h3>

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
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="login-input"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-button" onClick={handleRegister}>
          Register
        </button>

        <p style={{ marginTop: '10px' }}>
          Already have an account?{' '}
          <span
            style={{ color: '#4caf50', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;