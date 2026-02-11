const nodemailer = require('nodemailer');

/**
 * Email service using Nodemailer with SMTP
 * Supports SendGrid, Mailgun, Postmark (all provide SMTP)
 * Configure via environment variables - never use personal email in production
 */

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn('Email: SMTP credentials not configured. Emails will not be sent.');
    return null;
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass
    }
  });

  return transporter;
};

/**
 * Send email
 * @param {Object} options - { to, subject, text, html }
 */
const sendEmail = async (options) => {
  const transport = getTransporter();
  if (!transport) {
    return { success: false, error: 'Email service not configured' };
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  const mailOptions = {
    from: `"${process.env.APP_NAME || 'App'}" <${from}>`,
    to: options.to,
    subject: options.subject,
    text: options.text || '',
    html: options.html || options.text || ''
  };

  try {
    await transport.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send welcome/verification email
 */
const sendWelcomeEmail = async (email, name = 'User') => {
  return sendEmail({
    to: email,
    subject: 'Welcome!',
    text: `Hello ${name}, welcome to our application!`,
    html: `<h1>Welcome, ${name}!</h1><p>Thank you for registering.</p>`
  });
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (email, resetToken, resetUrl) => {
  const url = resetUrl || `${process.env.APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  return sendEmail({
    to: email,
    subject: 'Password Reset Request',
    html: `<p>You requested a password reset. Click the link: <a href="${url}">${url}</a></p><p>This link expires in 1 hour.</p>`
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail
};
