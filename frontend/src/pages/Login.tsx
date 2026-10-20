import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import '../styles/learning-theme.css';
import './Auth.css';

// Simple inline eye SVG — avoids any icon library dependency
const EyeIcon = ({ open }: { open: boolean }) => open ? (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // OTP verification stage
  const [otpStage, setOtpStage] = useState(false);
  const [notVerifiedEmail, setNotVerifiedEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState('');

  useEffect(() => {
    const state = location.state as { message?: string } | null;
    if (state?.message) {
      setSuccessMsg(state.message);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.email.trim() || !form.password) return setError('Email and password are required.');
    setIsLoading(true);
    try {
      await login({ email: form.email.trim(), password: form.password });
      navigate('/learning', { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed.';
      if (msg.toLowerCase().includes('verify')) {
        setNotVerifiedEmail(form.email.trim());
        setOtpStage(true);
      } else {
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    if (otp.length !== 6) return setOtpError('Enter the 6-digit code from your email.');
    setOtpLoading(true);
    try {
      await authAPI.verifyOTP(notVerifiedEmail, otp);
      setSuccessMsg('Email verified! You can now sign in.');
      setOtpStage(false);
      setOtp('');
    } catch (err: unknown) {
      setOtpError(err instanceof Error ? err.message : 'Verification failed.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResend = async () => {
    setResendMsg('');
    setResendLoading(true);
    try {
      await authAPI.resendOTP(notVerifiedEmail);
      setResendMsg('New OTP sent! Check your inbox.');
      setOtp('');
    } catch {
      setResendMsg('Failed to resend. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  // ── OTP verification stage ────────────────────────────────────────────────
  if (otpStage) {
    return (
      <div className="learn-root auth-page">
        <div className="auth-card">
          <div className="auth-card__header">
          <div className="auth-card__icon auth-card__icon--email" />
            <h1 className="auth-card__title">Verify your email</h1>
            <p className="auth-card__subtitle">
              Enter the 6-digit code sent to <strong>{notVerifiedEmail}</strong>
            </p>
          </div>

          {otpError && <div className="auth-alert auth-alert--error">{otpError}</div>}
          {resendMsg && (
            <div className={`auth-alert ${resendMsg.includes('sent') ? 'auth-alert--success' : 'auth-alert--error'}`}>
              {resendMsg}
            </div>
          )}

          <form onSubmit={handleVerifyOTP} className="auth-form" noValidate>
            <div className="auth-form__group">
              <label htmlFor="otp" className="auth-form__label">Verification code</label>
              <input
                id="otp" type="text" inputMode="numeric" pattern="[0-9]*"
                maxLength={6} value={otp}
                onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); setOtpError(''); }}
                className="auth-form__input otp-input"
                placeholder="000000"
                disabled={otpLoading}
                autoFocus
              />
            </div>
            <button type="submit" className="auth-form__submit" disabled={otpLoading || otp.length < 6}>
              {otpLoading ? <><span className="spinner spinner--sm" /> Verifying…</> : 'Verify Email'}
            </button>
          </form>

          <div className="auth-card__footer">
            <p>
              Didn't receive it?{' '}
              <button className="link-btn" onClick={handleResend} disabled={resendLoading}>
                {resendLoading ? 'Sending…' : 'Resend code'}
              </button>
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              <button className="link-btn" onClick={() => setOtpStage(false)}>← Back to sign in</button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Login form ────────────────────────────────────────────────────────────
  return (
    <div className="learn-root auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <div className="auth-card__icon auth-card__icon--wave" />
          <h1 className="auth-card__title">Welcome back</h1>
          <p className="auth-card__subtitle">Sign in to your account</p>
        </div>

        {successMsg && <div className="auth-alert auth-alert--success">{successMsg}</div>}
        {error && <div className="auth-alert auth-alert--error" role="alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="auth-form__group">
            <label htmlFor="email" className="auth-form__label">Email address</label>
            <input id="email" name="email" type="email" value={form.email}
              onChange={handleChange} className="auth-form__input"
              placeholder="you@example.com" autoComplete="email" disabled={isLoading} />
          </div>
          <div className="auth-form__group">
            <label htmlFor="password" className="auth-form__label">Password</label>
            <div className="auth-input-wrap">
              <input id="password" name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange} className="auth-form__input"
                placeholder="Your password" autoComplete="current-password" disabled={isLoading} />
              <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
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
