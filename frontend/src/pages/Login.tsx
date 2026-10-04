import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import '../styles/learning-theme.css';
import './Auth.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notVerifiedEmail, setNotVerifiedEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  useEffect(() => {
    const state = location.state as { message?: string } | null;
    if (state?.message) {
      setSuccessMsg(state.message);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setError(''); setNotVerifiedEmail(''); setResendSent(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setNotVerifiedEmail(''); setResendSent(false);
    if (!form.email.trim() || !form.password) return setError('Email and password are required.');
    setIsLoading(true);
    try {
      await login({ email: form.email.trim(), password: form.password });
      navigate('/learning', { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed.';
      if (msg.toLowerCase().includes('verify')) {
        setNotVerifiedEmail(form.email.trim());
      } else {
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await authAPI.resendOTP(notVerifiedEmail);
      setResendSent(true);
    } catch { setResendSent(true); }
    finally { setResendLoading(false); }
  };

  return (
    <div className="learn-root auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <div className="auth-card__icon">👋</div>
          <h1 className="auth-card__title">Welcome back</h1>
          <p className="auth-card__subtitle">Sign in to your account</p>
        </div>

        {successMsg && <div className="auth-alert auth-alert--success"><span>✓</span> {successMsg}</div>}
        {error      && <div className="auth-alert auth-alert--error"  role="alert"><span>⚠</span> {error}</div>}

        {notVerifiedEmail && (
          <div className="auth-alert auth-alert--warning" role="alert">
            <span>📧</span>
            <div style={{ flex: 1 }}>
              <strong>Email not verified.</strong> Please check your inbox for the OTP.
              {!resendSent ? (
                <div style={{ marginTop: '0.5rem' }}>
                  <button onClick={handleResend} disabled={resendLoading} className="resend-btn">
                    {resendLoading ? <><span className="spinner spinner--sm" /> Sending…</> : 'Resend OTP'}
                  </button>
                </div>
              ) : (
                <p style={{ marginTop: '0.4rem', fontSize: '0.8125rem', color: '#22c55e' }}>
                  ✓ New OTP sent! Check your inbox.
                </p>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="auth-form__group">
            <label htmlFor="email" className="auth-form__label">Email address</label>
            <input id="email" name="email" type="email" value={form.email}
              onChange={handleChange} className="auth-form__input"
              placeholder="you@example.com" autoComplete="email" disabled={isLoading} />
          </div>
          <div className="auth-form__group">
            <label htmlFor="password" className="auth-form__label">Password</label>
            <input id="password" name="password" type="password" value={form.password}
              onChange={handleChange} className="auth-form__input"
              placeholder="Your password" autoComplete="current-password" disabled={isLoading} />
          </div>
          <button type="submit" className="auth-form__submit" disabled={isLoading}>
            {isLoading ? <><span className="spinner spinner--sm" /> Signing in…</> : 'Sign In'}
          </button>
        </form>

        <p className="auth-card__footer">
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
