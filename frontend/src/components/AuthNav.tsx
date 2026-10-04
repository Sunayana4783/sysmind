import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AuthNav.css';

// Lightweight navbar for /login and /signup pages — light theme, no hamburger
const AuthNav = () => {
  const { pathname } = useLocation();

  return (
    <nav className="auth-nav">
      <Link to="/signup" className="auth-nav__brand">
        <span>⚡</span> SysMind
      </Link>
      <div className="auth-nav__links">
        <Link
          to="/login"
          className={`auth-nav__link${pathname === '/login' ? ' auth-nav__link--active' : ''}`}
        >
          Login
        </Link>
        <Link
          to="/signup"
          className={`auth-nav__link auth-nav__link--btn${pathname === '/signup' ? ' auth-nav__link--btn-active' : ''}`}
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default AuthNav;
