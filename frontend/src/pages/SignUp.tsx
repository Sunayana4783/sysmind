import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import '../styles/learning-theme.css';
import './Auth.css';

type Stage = 'form' | 'otp';

// Simple inline eye SVG
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

const SignUp = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [stage, setStage] = useState<Stage>('form');
  const [registeredEmail, setRegisteredEmail] = useState('');

  // Form state
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // OTP state
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState('');

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setFormError('');
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    const { username, email, password, confirmPassword } = form;
    if (!username.trim() || !email.trim() || !password || !confirmPassword)
      return setFormError('All fields are required.');
    if (username.trim().length < 3)
      return setFormError('Username must be at least 3 characters.');
    if (password.length < 6)
      return setFormError('Password must be at least 6 characters.');
    if (password !== confirmPassword)
      return setFormError('Passwords do not match.');

    setFormLoading(true);
    try {
      await signup({ username: username.trim(), email: email.trim(), password });
      setRegisteredEmail(email.trim());
      setStage('otp');
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Sign up failed.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    if (otp.length !== 6) return setOtpError('Enter the 6-digit code from your email.');
    setOtpLoading(true);
    try {
      await authAPI.verifyOTP(registeredEmail, otp);
      navigate('/login', { state: { message: 'Email verified! You can now log in.' } });
    } catch (err: unknown) {
      setOtpError(err instanceof Error ? err.message : 'Verification failed.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResend = async () => {
    setResendMsg('');
    setOtpError('');
    setResendLoading(true);
    try {
      await authAPI.resendOTP(registeredEmail);
      setResendMsg('New OTP sent! Check your inbox.');
      setOtp('');
    } catch (err: unknown) {
      setResendMsg(err instanceof Error ? err.message : 'Failed to resend.');
    } finally {
      setResendLoading(false);
    }
  };

  // ── OTP entry stage ───────────────────────────────────────────────────────
  if (stage === 'otp') {
    return (
      <div className="auth-page learn-root">
        <div className="auth-card">
          <div className="auth-card__header">
            <div className="auth-card__icon">📧</div>
            <h1 className="auth-card__title">Check your email</h1>
            <p className="auth-card__subtitle">
              We sent a 6-digit code to <strong>{registeredEmail}</strong>
            </p>
          </div>

          {otpError && (
            <div className="auth-alert auth-alert--error" role="alert">
              <span>⚠</span> {otpError}
            </div>
          )}
          {resendMsg && (
            <div className={`auth-alert ${resendMsg.includes('sent') ? 'auth-alert--success' : 'auth-alert--error'}`}>
              <span>{resendMsg.includes('sent') ? '✓' : '⚠'}</span> {resendMsg}
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
            <p>Didn't receive it?{' '}
              <button className="link-btn" onClick={handleResend} disabled={resendLoading}>
                {resendLoading ? 'Sending…' : 'Resend code'}
              </button>
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              <button className="link-btn" onClick={() => setStage('form')}>← Back to sign up</button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Signup form stage ─────────────────────────────────────────────────────
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <div className="auth-card__icon">🚀</div>
          <h1 className="auth-card__title">Create your account</h1>
          <p className="auth-card__subtitle">Start your journey today</p>
        </div>

        {formError && (
          <div className="auth-alert auth-alert--error" role="alert">
            <span>⚠</span> {formError}
          </div>
        )}

        <form onSubmit={handleSignup} className="auth-form" noValidate>
          {/* Username */}
          <div className="auth-form__group">
            <label htmlFor="username" className="auth-form__label">Username</label>
            <input
              id="username" name="username" type="text"
              value={form.username} onChange={handleFormChange}
              className="auth-form__input"
              placeholder="e.g. johndoe"
              autoComplete="username"
              disabled={formLoading}
            />
          </div>

          {/* Email */}
          <div className="auth-form__group">
            <label htmlFor="email" className="auth-form__label">Email</label>
            <input
              id="email" name="email" type="email"
              value={form.email} onChange={handleFormChange}
              className="auth-form__input"
              placeholder="you@example.com"
              autoComplete="email"
              disabled={formLoading}
            />
          </div>

          {/* Password */}
          <div className="auth-form__group">
            <label htmlFor="password" className="auth-form__label">Password</label>
            <div className="auth-input-wrap">
              <input
                id="password" name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password} onChange={handleFormChange}
                className="auth-form__input"
                placeholder="Min. 6 characters"
                autoComplete="new-password"
                disabled={formLoading}
              />
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

          {/* Confirm Password */}
          <div className="auth-form__group">
            <label htmlFor="confirmPassword" className="auth-form__label">Confirm password</label>
            <div className="auth-input-wrap">
              <input
                id="confirmPassword" name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={form.confirmPassword} onChange={handleFormChange}
                className="auth-form__input"
                placeholder="Re-enter your password"
                autoComplete="new-password"
                disabled={formLoading}
              />
              <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShowConfirmPassword(v => !v)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                <EyeIcon open={showConfirmPassword} />
              </button>
            </div>
          </div>

          <button type="submit" className="auth-form__submit" disabled={formLoading}>
            {formLoading ? <><span className="spinner spinner--sm" /> Creating account…</> : 'Create Account'}
          </button>
        </form>

        <p className="auth-card__footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
