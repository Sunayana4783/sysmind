import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import '../styles/learning-theme.css';
import './Auth.css';

type Stage = 'form' | 'otp';

const SignUp = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [stage, setStage] = useState<Stage>('form');
  const [registeredEmail, setRegisteredEmail] = useState('');

  // Form state
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
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
          {(['username', 'email', 'password', 'confirmPassword'] as const).map(field => (
            <div className="auth-form__group" key={field}>
              <label htmlFor={field} className="auth-form__label">
                {field === 'confirmPassword' ? 'Confirm password'
                  : field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
              </label>
              <input
                id={field} name={field}
                type={field.includes('assword') ? 'password' : field === 'email' ? 'email' : 'text'}
                value={form[field]} onChange={handleFormChange}
                className="auth-form__input"
                placeholder={
                  field === 'username' ? 'e.g. johndoe'
                  : field === 'email' ? 'you@example.com'
                  : field === 'password' ? 'Min. 6 characters'
                  : 'Re-enter your password'
                }
                autoComplete={field === 'confirmPassword' ? 'new-password' : field === 'password' ? 'new-password' : field}
                disabled={formLoading}
              />
            </div>
          ))}

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
