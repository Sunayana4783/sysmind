import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LearningNav.css';

export interface SubItem {
  label: string;
  id: string;
  active?: boolean;
  onClick: () => void;
}

interface LearningNavProps {
  /** Optional topic list shown as a sub-section inside the hamburger menu */
  subItems?: {
    title: string;
    items: SubItem[];
  };
}

const NAV_ITEMS = [
  { label: 'Learning Interface', to: '/learning'  },
  { label: 'Dashboard',          to: '/dashboard' },
  { label: 'Profile',            to: '/profile'   },
];

const LearningNav = ({ subItems }: LearningNavProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="lnav" aria-label="Learning navigation">
      {/* Brand — left */}
      <Link to="/learning" className="lnav__brand">
        <svg width="14" height="18" viewBox="0 0 14 18" fill="none" aria-hidden="true" style={{flexShrink:0}}>
          <path d="M8 0L0 10h6l-1 8 8-10H7L8 0z" fill="#7C5CFC"/>
        </svg>
        SysMind
      </Link>

      {/* Right: hamburger only */}
      <div className="lnav__right">

        <div className="lnav__hamburger-wrap" ref={menuRef}>
          <button
            className={`lnav__hamburger${open ? ' lnav__hamburger--open' : ''}`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span /><span /><span />
          </button>

          {open && (
            <div className="lnav__menu" role="menu">
              {/* ── Main nav links ─────────────────────────── */}
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`lnav__menu-item${location.pathname === item.to ? ' lnav__menu-item--active' : ''}`}
                  role="menuitem"
                >
                  {item.label}
                </Link>
              ))}

              {/* ── Topic sub-section (optional) ───────────── */}
              {subItems && subItems.items.length > 0 && (
                <>
                  <div className="lnav__menu-divider" />
                  <div className="lnav__menu-section-label">{subItems.title}</div>
                  {subItems.items.map((item) => (
                    <button
                      key={item.id}
                      className={`lnav__menu-item lnav__menu-item--topic${item.active ? ' lnav__menu-item--active' : ''}`}
                      onClick={() => { item.onClick(); setOpen(false); }}
                      role="menuitem"
                    >
                      <span className="lnav__menu-topic-dot" />
                      {item.label}
                    </button>
                  ))}
                </>
              )}

              <div className="lnav__menu-divider" />
              <button
                className="lnav__menu-item lnav__menu-item--logout"
                onClick={handleLogout}
                role="menuitem"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default LearningNav;
