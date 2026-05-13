const nodemailer = require("nodemailer");

function createTransporter() {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return null;
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
}

async function sendEmail({ to, subject, text }) {
  const transporter = createTransporter();
  if (!transporter) {
    console.log("Email skipped because Gmail SMTP env vars are missing:", { to, subject });
    return;
  }

  await transporter.sendMail({
    from: `"SoftBranch Careers" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    text
  });
}

module.exports = { sendEmail };
