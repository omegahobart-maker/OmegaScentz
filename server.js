const express = require('express');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const SITE_DIR = path.join(__dirname, 'gaming-deals-hub');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(SITE_DIR));

function validEmail(e) {
  return typeof e === 'string' && /\S+@\S+\.\S+/.test(e);
}

app.post('/subscribe', async (req, res) => {
  const { email } = req.body || {};
  if (!validEmail(email)) return res.status(400).json({ error: 'Invalid email' });

  // append to a simple subscribers list
  try {
    const file = path.join(SITE_DIR, 'subscribers.txt');
    fs.appendFileSync(file, email + '\n');
  } catch (err) {
    console.error('Could not write subscribers file', err);
  }

  const SMTP_HOST = process.env.SMTP_HOST;
  const SMTP_PORT = process.env.SMTP_PORT;
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;
  const TO_EMAIL = process.env.TO_EMAIL;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !TO_EMAIL) {
    console.error('Missing SMTP or TO_EMAIL environment variables');
    return res.status(500).json({ error: 'Server not configured to send email' });
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const mailOpts = {
    from: `Website <${SMTP_USER}>`,
    to: TO_EMAIL,
    subject: 'New subscriber — Gaming Deals Hub',
    text: `New subscription: ${email}`,
    html: `<p>New subscription: <strong>${email}</strong></p>`,
  };

  try {
    await transporter.sendMail(mailOpts);
    return res.json({ success: true });
  } catch (err) {
    console.error('Failed to send notification email', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Serving site from ${SITE_DIR}`);
});
