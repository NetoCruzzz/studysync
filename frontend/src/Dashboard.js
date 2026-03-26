import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>Dashboard</h1>
        <p>Welcome to StudySync 🎯</p>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    color: 'white'
  },
  card: {
    backgroundColor: '#1e1e1e',
    padding: '40px',
    borderRadius: '10px',
    textAlign: 'center'
  },
  logoutBtn: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};

export default Dashboard;