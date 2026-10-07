const { BrevoClient } = require('@getbrevo/brevo');

// ── Send OTP email via Brevo HTTP API (port 443 — works on Render free tier) ──
const sendOTPEmail = async ({ to, username, otp }) => {
  const client = new BrevoClient({ apiKey: process.env.BREVO_API_KEY });

  await client.transactionalEmails.sendTransacEmail({
    subject: `${otp} is your SysMind verification code`,
    sender: { name: 'SysMind', email: 'sunayanakatukam4@gmail.com' },
    to: [{ email: to }],
    textContent: `Hi ${username},\n\nYour SysMind verification code is: ${otp}\n\nExpires in 10 minutes. Do not share this code.`,
    htmlContent: `
<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:40px 20px;background:#FAF9FC;">
  <div style="background:#7C5CFC;border-radius:12px 12px 0 0;padding:24px;text-align:center;">
    <h1 style="color:#fff;margin:0;font-size:20px;">SysMind</h1>
  </div>
  <div style="background:#fff;border:1.5px solid #E5E0EF;border-top:none;border-radius:0 0 12px 12px;padding:32px 24px;text-align:center;">
    <h2 style="color:#24212B;margin:0 0 8px;">Verify your email</h2>
    <p style="color:#716B7A;margin:0 0 24px;">Hi <strong>${username}</strong>, your verification code is:</p>
    <div style="background:#EEE9FF;border:2px solid #7C5CFC;border-radius:12px;display:inline-block;padding:16px 40px;margin-bottom:24px;">
      <span style="font-size:32px;font-weight:800;color:#7C5CFC;letter-spacing:0.15em;font-family:monospace;">${otp}</span>
    </div>
    <p style="color:#A89FC0;font-size:13px;margin:0;">Expires in 10 minutes. Do not share this code.</p>
  </div>
</div>`,
  });

  console.log(`OTP email sent via Brevo API to: ${to}`);
};

module.exports = { sendOTPEmail };
