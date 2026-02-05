import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="header">
      <div className="logo">AZEXAI</div>
      <nav className="nav">
        <Link to="/">Home</Link>
        {isAuthenticated && <Link to="/dashboard">Dashboard</Link>}
        <Link to="/analytics">Analytics</Link>
        <Link to="/about">About</Link>
        
        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '14px', color: '#888' }}>{user?.fullName?.split(' ')[0]}</span>
            <button 
              onClick={logout}
              className="cta"
              style={{ cursor: 'pointer' }}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link className="cta" to="/login">Launch Platform</Link>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
