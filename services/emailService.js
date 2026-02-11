const nodemailer = require('nodemailer');

// Create transporter (configure with your SMTP provider)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Send welcome email
const sendWelcomeEmail = async (email, username) => {
  // Skip if SMTP not configured
  if (!process.env.SMTP_HOST) {
    console.log('SMTP not configured, skipping email');
    return;
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@coffeeshop.com',
    to: email,
    subject: 'Welcome to Freddie Coffee Shop!',
    html: `
      <h1>Welcome, ${username}!</h1>
      <p>Thank you for registering at Freddie Coffee Shop.</p>
      <p>Enjoy our delicious coffee and treats!</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent to:', email);
  } catch (error) {
    console.error('Email error:', error.message);
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken) => {
  if (!process.env.SMTP_HOST) {
    console.log('SMTP not configured, skipping email');
    return;
  }

  const resetUrl = `${process.env.APP_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@coffeeshop.com',
    to: email,
    subject: 'Password Reset Request',
    html: `
      <h1>Password Reset</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link expires in 1 hour.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendWelcomeEmail, sendPasswordResetEmail };
