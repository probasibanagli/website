const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

async function testEmail() {
  const email = process.env.GMAIL_EMAIL;
  // Clean quotes if present
  let password = process.env.GMAIL_PASSWORD || '';
  if (password.startsWith('"') && password.endsWith('"')) {
    password = password.slice(1, -1);
  }

  console.log('Testing SMTP connection with:');
  console.log('Email:', email);
  console.log('Password length:', password.length);
  console.log('Password starts with:', password.substring(0, 3) + '...');

  if (!email || !password) {
    console.error('Error: GMAIL_EMAIL or GMAIL_PASSWORD is not set in .env.local');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email,
      pass: password,
    },
  });

  try {
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('Success! SMTP connection is verified and working.');
  } catch (error) {
    console.error('SMTP Verification Failed:');
    console.error(error);
  }
}

testEmail();
