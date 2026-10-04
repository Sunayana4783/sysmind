import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <Link to={isAuthenticated ? '/dashboard' : '/signup'} className="navbar__logo">
          <span className="navbar__logo-icon">⚡</span>
          SysMind
        </Link>
      </div>

      <div className="navbar__actions">
        {isAuthenticated ? (
          <>
            <span className="navbar__user-greeting">
              Welcome, <strong>{user?.username}</strong>
            </span>
            <button className="btn btn--outline btn--sm" onClick={handleLogout}>
              <span>→</span> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn--ghost btn--sm">
              Login
            </Link>
            <Link to="/signup" className="btn btn--primary btn--sm">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
