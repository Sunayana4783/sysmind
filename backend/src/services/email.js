const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,  // port 465 uses SSL directly
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// ── Send OTP email ────────────────────────────────────────────────────────────
const sendOTPEmail = async ({ to, username, otp }) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'SysMind <no-reply@sysmind.dev>',
    to,
    subject: `${otp} is your SysMind verification code`,
    text: `Hi ${username},\n\nYour SysMind verification code is: ${otp}\n\nThis code expires in 10 minutes. Do not share it with anyone.\n\nIf you did not create an account, ignore this email.`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#FAF9FC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF9FC;padding:40px 16px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0"
        style="background:#ffffff;border-radius:16px;border:1.5px solid #E5E0EF;overflow:hidden;">

        <!-- Header -->
        <tr>
          <td style="background:#7C5CFC;padding:28px 40px;text-align:center;">
            <p style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.03em;">⚡ SysMind</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px 28px;">
            <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#24212B;">Verify your email</h1>
            <p style="margin:0 0 24px;font-size:14px;color:#716B7A;line-height:1.6;">
              Hi <strong style="color:#24212B;">${username}</strong>, enter this code to activate your account.
            </p>

            <!-- OTP Box -->
            <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
              <tr>
                <td style="background:#EEE9FF;border:2px solid #7C5CFC;border-radius:12px;padding:20px 40px;text-align:center;">
                  <span style="font-size:36px;font-weight:800;color:#7C5CFC;letter-spacing:0.15em;font-family:monospace;">${otp}</span>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 8px;font-size:13px;color:#A89FC0;text-align:center;">
              This code expires in <strong>10 minutes</strong>.
            </p>
            <p style="margin:0;font-size:13px;color:#A89FC0;text-align:center;">
              Maximum <strong>3 attempts</strong>. Do not share this code with anyone.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#FAF9FC;padding:16px 40px;border-top:1px solid #E5E0EF;">
            <p style="margin:0;font-size:12px;color:#A89FC0;text-align:center;">
              © ${new Date().getFullYear()} SysMind. If you didn't request this, ignore this email.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOTPEmail };
