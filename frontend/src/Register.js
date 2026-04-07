import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        alert('Registered successfully!');
        navigate('/');
      } else {
        alert(data.message || 'Registration failed');
      }

    } catch (err) {
      console.log("Backend not running — fallback mode");

      // ✅ FALLBACK (so you’re not blocked)
      alert("Backend not connected — simulating registration");

      navigate('/dashboard', {
        state: { username, email }
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>StudySync</h1>
        <h3>Register</h3>

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