const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { sendOTPEmail } = require('../services/email');

const router = express.Router();

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/signup
// Creates unverified account and sends OTP email
// ─────────────────────────────────────────────────────────────────────────────
router.post(
  '/signup',
  [
    body('username').trim().isLength({ min: 3, max: 30 }).withMessage('Username must be 3–30 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

    const { username, email, password } = req.body;

    try {
      const existing = await User.findOne({ email });
      if (existing) {
        if (!existing.isVerified) {
          // Already registered but not verified — resend OTP
          const otp = existing.generateOTP();
          await existing.save();
          try { await sendOTPEmail({ to: email, username: existing.username, otp }); } catch (_) {}
          return res.status(200).json({
            message: 'Account exists but is not verified. A new OTP has been sent.',
            email,
          });
        }
        return res.status(409).json({ message: 'An account with this email already exists.' });
      }

      const user = await User.create({ username, email, password });
      const otp = user.generateOTP();
      await user.save();

      try { await sendOTPEmail({ to: email, username, otp }); } catch (e) {
        console.error('Email error:', e.message);
      }

      res.status(201).json({
        message: 'Account created! Enter the 6-digit OTP sent to your email.',
        email,
      });
    } catch (err) {
      if (err.code === 11000) return res.status(409).json({ message: 'An account with this email already exists.' });
      console.error('Signup error:', err);
      res.status(500).json({ message: 'Server error. Please try again.' });
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/verify-otp
// Verifies the 6-digit OTP
// ─────────────────────────────────────────────────────────────────────────────
router.post(
  '/verify-otp',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

    const { email, otp } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'No account found with this email.' });
      if (user.isVerified) return res.status(400).json({ message: 'Email is already verified.' });

      const result = user.verifyOTP(otp);

      if (!result.valid) {
        await user.save(); // persist incremented otpAttempts
        const messages = {
          expired: 'OTP has expired. Please request a new one.',
          max_attempts: 'Too many incorrect attempts. Please request a new OTP.',
          wrong_otp: `Incorrect OTP. ${result.attemptsLeft} attempt${result.attemptsLeft !== 1 ? 's' : ''} remaining.`,
          no_otp: 'No OTP found. Please request a new one.',
        };
        return res.status(400).json({ message: messages[result.reason] || 'Invalid OTP.', reason: result.reason });
      }

      // Success — activate account
      user.isVerified = true;
      user.clearOTP();
      await user.save();

      res.json({ message: 'Email verified successfully! You can now log in.' });
    } catch (err) {
      console.error('OTP verify error:', err);
      res.status(500).json({ message: 'Server error. Please try again.' });
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/resend-otp
// Generates and sends a fresh OTP
// ─────────────────────────────────────────────────────────────────────────────
router.post(
  '/resend-otp',
  [body('email').isEmail().normalizeEmail().withMessage('Valid email required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      // Always return success to avoid exposing whether email is registered
      if (!user || user.isVerified) {
        return res.json({ message: 'If that email is registered and unverified, a new OTP has been sent.' });
      }

      const otp = user.generateOTP();
      await user.save();
      await sendOTPEmail({ to: email, username: user.username, otp });

      res.json({ message: 'New OTP sent. Please check your inbox.' });
    } catch (err) {
      console.error('Resend OTP error:', err);
      res.status(500).json({ message: 'Server error. Please try again.' });
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────────────────────────────────────────
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email }).select('+password');
      if (!user) return res.status(401).json({ message: 'Invalid email or password.' });

      const isMatch = await user.comparePassword(password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid email or password.' });

      if (!user.isVerified) {
        return res.status(403).json({
          message: 'Please verify your email before logging in.',
          notVerified: true,
          email: user.email,
        });
      }

      const token = generateToken(user._id);
      res.json({ message: 'Login successful.', token, user });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ message: 'Server error. Please try again.' });
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/auth/me  — protected
// ─────────────────────────────────────────────────────────────────────────────
router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
