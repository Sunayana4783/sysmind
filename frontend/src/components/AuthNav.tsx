import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AuthNav.css';

// Lightweight navbar for /login and /signup pages — light theme, no hamburger
const AuthNav = () => {
  const { pathname } = useLocation();

  return (
    <nav className="auth-nav">
      <Link to="/signup" className="auth-nav__brand">
        <svg width="14" height="18" viewBox="0 0 14 18" fill="none" aria-hidden="true" style={{flexShrink:0}}>
          <path d="M8 0L0 10h6l-1 8 8-10H7L8 0z" fill="#7C5CFC"/>
        </svg>
        SysMind
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
