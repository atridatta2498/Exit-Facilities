const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Store OTPs temporarily (in production, use Redis or similar)
const otpStore = new Map();

// Email transporter setup
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',  // Replace with your SMTP server
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,     // Add these to your .env file
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Generate OTP
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

// Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Verify email domain and pattern
    if (!email.match(/^\d{2}[A-Za-z]\d{2}[A-Za-z]\d{4}@sves\.org\.in$/)) {
      return res.status(400).json({ error: 'Please use your valid college email address' });
    }

    const otp = generateOTP();
    otpStore.set(email, {
      otp,
      timestamp: Date.now(),
      attempts: 0
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'SVEC Feedback Form Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">SVEC Feedback Form Verification</h2>
          <p>Your verification code is:</p>
          <h1 style="color: #4CAF50; font-size: 36px; letter-spacing: 5px;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `
    });

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('OTP Send Error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Verify OTP
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  const storedData = otpStore.get(email);

  if (!storedData) {
    return res.status(400).json({ error: 'No OTP found for this email' });
  }

  // Check if OTP is expired (10 minutes)
  if (Date.now() - storedData.timestamp > 10 * 60 * 1000) {
    otpStore.delete(email);
    return res.status(400).json({ error: 'OTP expired' });
  }

  // Check attempts
  if (storedData.attempts >= 3) {
    otpStore.delete(email);
    return res.status(400).json({ error: 'Too many attempts. Please request a new OTP' });
  }

  // Increment attempts
  storedData.attempts++;
  otpStore.set(email, storedData);

  if (storedData.otp !== otp) {
    return res.status(400).json({ error: 'Invalid OTP' });
  }

  // Success - clear OTP
  otpStore.delete(email);
  res.json({ message: 'Email verified successfully' });
});

module.exports = router;