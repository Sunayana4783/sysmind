const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },

    // ── OTP-based email verification ──────────────────────────────────────
    isVerified: { type: Boolean, default: false },

    // OTP fields (replace old token-link fields)
    otp: { type: String, default: null },                  // hashed OTP
    otpExpiry: { type: Date, default: null },              // 10 min from send
    otpAttempts: { type: Number, default: 0 },             // max 3 attempts
  },
  { timestamps: true }
);

// ── Hash password before saving ───────────────────────────────────────────────
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// ── Compare plain password against hash ──────────────────────────────────────
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// ── Generate a 6-digit OTP, hash it, set 10-min expiry ───────────────────────
userSchema.methods.generateOTP = function () {
  // Cryptographically secure 6-digit OTP
  const otp = String(crypto.randomInt(100000, 999999));
  // Hash the OTP before storing — never store plain OTP
  this.otp = crypto.createHash('sha256').update(otp).digest('hex');
  this.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  this.otpAttempts = 0;
  return otp; // return plain OTP to send in email
};

// ── Verify a submitted OTP ───────────────────────────────────────────────────
userSchema.methods.verifyOTP = function (submittedOtp) {
  if (!this.otp || !this.otpExpiry) return { valid: false, reason: 'no_otp' };
  if (new Date() > this.otpExpiry) return { valid: false, reason: 'expired' };
  if (this.otpAttempts >= 3) return { valid: false, reason: 'max_attempts' };

  const hash = crypto.createHash('sha256').update(String(submittedOtp)).digest('hex');
  if (hash !== this.otp) {
    this.otpAttempts += 1;
    return { valid: false, reason: 'wrong_otp', attemptsLeft: 3 - this.otpAttempts };
  }
  return { valid: true };
};

// ── Clear OTP fields after successful verification ───────────────────────────
userSchema.methods.clearOTP = function () {
  this.otp = null;
  this.otpExpiry = null;
  this.otpAttempts = 0;
};

// ── Strip sensitive fields from JSON responses ────────────────────────────────
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.otp;
  delete obj.otpExpiry;
  delete obj.otpAttempts;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
