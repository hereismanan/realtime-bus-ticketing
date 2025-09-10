const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
async function sendBookingEmail(to, subject, html, attachments) {
  const msg = { to, from: 'no-reply@example.com', subject, html };
  if (attachments) msg.attachments = attachments;
  return sgMail.send(msg);
}
module.exports = { sendBookingEmail };