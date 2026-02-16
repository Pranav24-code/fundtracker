const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  // Only create transporter if SMTP credentials are configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('⚠️  Email not configured - SMTP credentials missing');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

/**
 * Send email
 */
exports.sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = createTransporter();

    if (!transporter) {
      console.log(`📧 Email skipped (not configured): ${subject} -> ${to}`);
      return false;
    }

    const info = await transporter.sendMail({
      from: `PETMS <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
};

/**
 * Send red flag alert email
 */
exports.sendAlertEmail = async ({ to, subject, project, riskFactors }) => {
  const html = `
    <h2>⚠️ Red Flag Alert</h2>
    <p>Project: <strong>${project.title}</strong></p>
    <p>Location: ${project.location?.city || 'N/A'}, ${project.location?.state || 'N/A'}</p>
    <p>Risk Factors:</p>
    <ul>
      ${riskFactors.map((factor) => `<li>${factor}</li>`).join('')}
    </ul>
    <p>Please investigate immediately.</p>
  `;

  return exports.sendEmail({ to, subject, html });
};
