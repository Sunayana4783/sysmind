import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/learning-theme.css';

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="learn-root" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ width: 36, height: 36, border: '3px solid #EEE9FF', borderTopColor: '#7C5CFC', borderRadius: '50%', animation: 'spin 0.75s linear infinite' }} />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="learn-root" style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div style={{ textAlign: 'center', background: 'var(--l-card)', border: '1.5px solid var(--l-border)', borderRadius: 16, padding: '3rem 2.5rem', maxWidth: 400, width: '100%', boxShadow: '0 4px 24px rgba(124,92,252,0.08)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--l-text)', marginBottom: '0.5rem' }}>You are already logged in.</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--l-text-sec)', marginBottom: '1.75rem' }}>Please go to the learning interface to continue.</p>
          <a href="/learning" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--l-primary)', color: '#fff', padding: '0.65rem 1.75rem', borderRadius: 8, fontWeight: 600, fontSize: '0.9375rem', textDecoration: 'none', transition: 'background 0.15s' }}>
            Go to Learning Interface
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PublicRoute;
