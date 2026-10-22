import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import '../styles/learning-theme.css';
import './Auth.css';

// ── Eye icon SVG ──────────────────────────────────────────────────────────────
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

// ── Stage type ────────────────────────────────────────────────────────────────
type Stage =
  | 'login'         // main login form
  | 'verify-email'  // OTP for unverified account (existing flow)
  | 'fp-email'      // forgot password: enter email
  | 'fp-otp'        // forgot password: enter OTP
  | 'fp-newpass';   // forgot password: enter new password

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ── Login form state ──────────────────────────────────────────────────────
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ── Stage ─────────────────────────────────────────────────────────────────
  const [stage, setStage] = useState<Stage>('login');

  // ── Shared OTP state (used by both verify-email and fp-otp) ──────────────
  const [otpEmail, setOtpEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState('');

  // ── Forgot password state ─────────────────────────────────────────────────
  const [fpEmail, setFpEmail] = useState('');
  const [fpEmailLoading, setFpEmailLoading] = useState(false);
  const [fpEmailError, setFpEmailError] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [newPassError, setNewPassError] = useState('');
  const [newPassLoading, setNewPassLoading] = useState(false);

  useEffect(() => {
    const state = location.state as { message?: string } | null;
    if (state?.message) {
      setSuccessMsg(state.message);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, []);

  const resetToLogin = () => {
    setStage('login');
    setOtp(''); setOtpError(''); setResendMsg('');
    setFpEmail(''); setFpEmailError('');
    setResetToken(''); setNewPassword(''); setConfirmNewPassword('');
    setNewPassError('');
  };

  // ── Login submit ──────────────────────────────────────────────────────────
  const handleLoginSubmit = async (e: React.FormEvent) => {
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
        setOtpEmail(form.email.trim());
        setStage('verify-email');
      } else {
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── Verify email OTP (unverified account) ────────────────────────────────
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    if (otp.length !== 6) return setOtpError('Enter the 6-digit code from your email.');
    setOtpLoading(true);
    try {
      await authAPI.verifyOTP(otpEmail, otp);
      setSuccessMsg('Email verified! You can now sign in.');
      resetToLogin();
    } catch (err: unknown) {
      setOtpError(err instanceof Error ? err.message : 'Verification failed.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendVerify = async () => {
    setResendMsg(''); setResendLoading(true);
    try {
      await authAPI.resendOTP(otpEmail);
      setResendMsg('New code sent! Check your inbox.');
      setOtp('');
    } catch { setResendMsg('Failed to resend. Please try again.'); }
    finally { setResendLoading(false); }
  };

  // ── Forgot password: step 1 - send OTP to email ───────────────────────────
  const handleFpEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFpEmailError('');
    if (!fpEmail.trim()) return setFpEmailError('Please enter your email address.');
    setFpEmailLoading(true);
    try {
      await authAPI.forgotPassword(fpEmail.trim());
      setOtpEmail(fpEmail.trim());
      setOtp(''); setOtpError(''); setResendMsg('');
      setStage('fp-otp');
    } catch (err: unknown) {
      setFpEmailError(err instanceof Error ? err.message : 'Failed to send reset code.');
    } finally {
      setFpEmailLoading(false);
    }
  };

  // ── Forgot password: step 2 - verify OTP ─────────────────────────────────
  const handleFpOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    if (otp.length !== 6) return setOtpError('Enter the 6-digit code from your email.');
    setOtpLoading(true);
    try {
      const res = await authAPI.verifyResetOtp(otpEmail, otp);
      setResetToken(res.data.resetToken);
      setOtp('');
      setStage('fp-newpass');
    } catch (err: unknown) {
      setOtpError(err instanceof Error ? err.message : 'Verification failed.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendReset = async () => {
    setResendMsg(''); setResendLoading(true);
    try {
      await authAPI.forgotPassword(otpEmail);
      setResendMsg('New reset code sent! Check your inbox.');
      setOtp('');
    } catch { setResendMsg('Failed to resend. Please try again.'); }
    finally { setResendLoading(false); }
  };

  // ── Forgot password: step 3 - set new password ────────────────────────────
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewPassError('');
    if (newPassword.length < 6) return setNewPassError('Password must be at least 6 characters.');
    if (newPassword !== confirmNewPassword) return setNewPassError('Passwords do not match.');
    setNewPassLoading(true);
    try {
      await authAPI.resetPassword(resetToken, newPassword);
      setSuccessMsg('Password reset successfully. Sign in with your new password.');
      resetToLogin();
    } catch (err: unknown) {
      setNewPassError(err instanceof Error ? err.message : 'Reset failed. Please start over.');
    } finally {
      setNewPassLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // STAGE: verify-email (unverified account OTP)
  // ─────────────────────────────────────────────────────────────────────────
  if (stage === 'verify-email') {
    return (
      <div className="learn-root auth-page">
        <div className="auth-card">
          <div className="auth-card__header">
            <h1 className="auth-card__title">Verify your email</h1>
            <p className="auth-card__subtitle">
              Enter the 6-digit code sent to <strong>{otpEmail}</strong>
            </p>
          </div>
          {otpError  && <div className="auth-alert auth-alert--error">{otpError}</div>}
          {resendMsg && <div className={`auth-alert ${resendMsg.includes('sent') ? 'auth-alert--success' : 'auth-alert--error'}`}>{resendMsg}</div>}
          <form onSubmit={handleVerifyOTP} className="auth-form" noValidate>
            <div className="auth-form__group">
              <label htmlFor="otp" className="auth-form__label">Verification code</label>
              <input id="otp" type="text" inputMode="numeric" pattern="[0-9]*"
                maxLength={6} value={otp}
                onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); setOtpError(''); }}
                className="auth-form__input otp-input"
                placeholder="000000" disabled={otpLoading} autoFocus />
            </div>
            <button type="submit" className="auth-form__submit" disabled={otpLoading || otp.length < 6}>
              {otpLoading ? <><span className="spinner spinner--sm" /> Verifying</> : 'Verify Email'}
            </button>
          </form>
          <div className="auth-card__footer">
            <p>Didn't receive it?{' '}
              <button className="link-btn" onClick={handleResendVerify} disabled={resendLoading}>
                {resendLoading ? 'Sending' : 'Resend code'}
              </button>
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              <button className="link-btn" onClick={resetToLogin}>Back to sign in</button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // STAGE: fp-email — enter email to receive reset OTP
  // ─────────────────────────────────────────────────────────────────────────
  if (stage === 'fp-email') {
    return (
      <div className="learn-root auth-page">
        <div className="auth-card">
          <div className="auth-card__header">
            <h1 className="auth-card__title">Forgot password</h1>
            <p className="auth-card__subtitle">Enter your account email and we will send a reset code.</p>
          </div>
          {fpEmailError && <div className="auth-alert auth-alert--error">{fpEmailError}</div>}
          <form onSubmit={handleFpEmailSubmit} className="auth-form" noValidate>
            <div className="auth-form__group">
              <label htmlFor="fp-email" className="auth-form__label">Email address</label>
              <input id="fp-email" type="email" value={fpEmail}
                onChange={e => { setFpEmail(e.target.value); setFpEmailError(''); }}
                className="auth-form__input"
                placeholder="you@example.com"
                autoComplete="email"
                disabled={fpEmailLoading}
                autoFocus />
            </div>
            <button type="submit" className="auth-form__submit" disabled={fpEmailLoading || !fpEmail.trim()}>
              {fpEmailLoading ? <><span className="spinner spinner--sm" /> Sending</> : 'Send Reset Code'}
            </button>
          </form>
          <div className="auth-card__footer">
            <p><button className="link-btn" onClick={resetToLogin}>Back to sign in</button></p>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // STAGE: fp-otp — verify the reset OTP
  // ─────────────────────────────────────────────────────────────────────────
  if (stage === 'fp-otp') {
    return (
      <div className="learn-root auth-page">
        <div className="auth-card">
          <div className="auth-card__header">
            <h1 className="auth-card__title">Enter reset code</h1>
            <p className="auth-card__subtitle">
              We sent a 6-digit code to <strong>{otpEmail}</strong>
            </p>
          </div>
          {otpError  && <div className="auth-alert auth-alert--error">{otpError}</div>}
          {resendMsg && <div className={`auth-alert ${resendMsg.includes('sent') ? 'auth-alert--success' : 'auth-alert--error'}`}>{resendMsg}</div>}
          <form onSubmit={handleFpOtpSubmit} className="auth-form" noValidate>
            <div className="auth-form__group">
              <label htmlFor="fp-otp" className="auth-form__label">Reset code</label>
              <input id="fp-otp" type="text" inputMode="numeric" pattern="[0-9]*"
                maxLength={6} value={otp}
                onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); setOtpError(''); }}
                className="auth-form__input otp-input"
                placeholder="000000" disabled={otpLoading} autoFocus />
            </div>
            <button type="submit" className="auth-form__submit" disabled={otpLoading || otp.length < 6}>
              {otpLoading ? <><span className="spinner spinner--sm" /> Verifying</> : 'Verify Code'}
            </button>
          </form>
          <div className="auth-card__footer">
            <p>Didn't receive it?{' '}
              <button className="link-btn" onClick={handleResendReset} disabled={resendLoading}>
                {resendLoading ? 'Sending' : 'Resend code'}
              </button>
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              <button className="link-btn" onClick={() => setStage('fp-email')}>Back</button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // STAGE: fp-newpass — set new password
  // ─────────────────────────────────────────────────────────────────────────
  if (stage === 'fp-newpass') {
    return (
      <div className="learn-root auth-page">
        <div className="auth-card">
          <div className="auth-card__header">
            <h1 className="auth-card__title">Set new password</h1>
            <p className="auth-card__subtitle">Choose a strong password for your account.</p>
          </div>
          {newPassError && <div className="auth-alert auth-alert--error">{newPassError}</div>}
          <form onSubmit={handleResetPassword} className="auth-form" noValidate>
            <div className="auth-form__group">
              <label htmlFor="new-password" className="auth-form__label">New password</label>
              <div className="auth-input-wrap">
                <input id="new-password" type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => { setNewPassword(e.target.value); setNewPassError(''); }}
                  className="auth-form__input"
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  disabled={newPassLoading}
                  autoFocus />
                <button type="button" className="auth-eye-btn"
                  onClick={() => setShowNewPassword(v => !v)}
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}>
                  <EyeIcon open={showNewPassword} />
                </button>
              </div>
            </div>
            <div className="auth-form__group">
              <label htmlFor="confirm-new-password" className="auth-form__label">Confirm new password</label>
              <div className="auth-input-wrap">
                <input id="confirm-new-password" type={showConfirmNewPassword ? 'text' : 'password'}
                  value={confirmNewPassword}
                  onChange={e => { setConfirmNewPassword(e.target.value); setNewPassError(''); }}
                  className="auth-form__input"
                  placeholder="Re-enter new password"
                  autoComplete="new-password"
                  disabled={newPassLoading} />
                <button type="button" className="auth-eye-btn"
                  onClick={() => setShowConfirmNewPassword(v => !v)}
                  aria-label={showConfirmNewPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}>
                  <EyeIcon open={showConfirmNewPassword} />
                </button>
              </div>
            </div>
            <button type="submit" className="auth-form__submit"
              disabled={newPassLoading || !newPassword || !confirmNewPassword}>
              {newPassLoading ? <><span className="spinner spinner--sm" /> Saving</> : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // STAGE: login (default)
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="learn-root auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <h1 className="auth-card__title">Welcome back</h1>
          <p className="auth-card__subtitle">Sign in to your account</p>
        </div>

        {successMsg && <div className="auth-alert auth-alert--success">{successMsg}</div>}
        {error      && <div className="auth-alert auth-alert--error" role="alert">{error}</div>}

        <form onSubmit={handleLoginSubmit} className="auth-form" noValidate>
          <div className="auth-form__group">
            <label htmlFor="email" className="auth-form__label">Email address</label>
            <input id="email" name="email" type="email" value={form.email}
              onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setError(''); }}
              className="auth-form__input"
              placeholder="you@example.com" autoComplete="email" disabled={isLoading} />
          </div>

          <div className="auth-form__group">
            <div className="auth-form__label-row">
              <label htmlFor="password" className="auth-form__label">Password</label>
              <button
                type="button"
                className="auth-forgot-btn"
                onClick={() => { setFpEmail(form.email.trim()); setFpEmailError(''); setStage('fp-email'); }}
              >
                Forgot password?
              </button>
            </div>
            <div className="auth-input-wrap">
              <input id="password" name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={e => { setForm(p => ({ ...p, password: e.target.value })); setError(''); }}
                className="auth-form__input"
                placeholder="Your password" autoComplete="current-password" disabled={isLoading} />
              <button type="button" className="auth-eye-btn"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}>
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>

          <button type="submit" className="auth-form__submit" disabled={isLoading}>
            {isLoading ? <><span className="spinner spinner--sm" /> Signing in</> : 'Sign In'}
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
