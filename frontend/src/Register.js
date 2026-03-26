import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setMessage('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || 'Registration failed');
        return;
      }

      setMessage('Registration successful!');

      // redirect to login after success
      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (err) {
      setMessage('Server error');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>StudySync</h1>
        <h3>Register</h3>

        {message && <p className="error-text">{message}</p>}

        <form onSubmit={handleRegister}>
          <input
            className="login-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="login-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="login-button" type="submit">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;