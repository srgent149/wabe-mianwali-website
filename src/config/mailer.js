const nodemailer = require('nodemailer');
const env = require('./env');

const smtpConfigured = Boolean(env.smtp.host && env.smtp.user && env.smtp.pass);

let transporter;

if (smtpConfigured) {
  transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: { user: env.smtp.user, pass: env.smtp.pass },
  });
} else {
  // Dev fallback: log the "would-be-sent" email to the console instead of failing.
  transporter = {
    sendMail: async (options) => {
      console.log('\n----- [DEV] SMTP not configured, logging email instead of sending -----');
      console.log('To:', options.to);
      console.log('From:', options.from);
      console.log('Subject:', options.subject);
      console.log('Body:\n', options.text || options.html);
      console.log('----- [DEV] end of email -----\n');
      return { messageId: 'dev-fallback', accepted: [options.to] };
    },
  };
}

async function sendMail({ to, subject, text, html }) {
  return transporter.sendMail({
    from: env.smtp.from,
    to,
    subject,
    text,
    html,
  });
}

module.exports = { sendMail, smtpConfigured };
