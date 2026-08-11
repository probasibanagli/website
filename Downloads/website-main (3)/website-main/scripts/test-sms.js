const fetch = require('node-fetch');

const API_KEY = 'e5b0e5f6cbdc6a23b9e0bd29ce8522c4';
const SENDER_ID = 'VECTRC';
const TEMPLATE_ID = '1707177349007929181';

// Replace with a phone number to test (use India format e.g. 91xxxxxxxxxx)
const cleanedPhone = '919999999999'; 
const otpCode = '123456';

const messageText = `Dear user, Your OTP login verification ${otpCode} This OTP is valid for 5 mins Thank you. VECTRA`;
const smsUrl = `http://text.messagewall.in/api/smsapi?key=${API_KEY}&sender=${SENDER_ID}&number=${cleanedPhone}&route=2&templateid=${TEMPLATE_ID}&sms=${encodeURIComponent(messageText)}`;

async function testSMS() {
  console.log('Sending test SMS to MessageWall gateway...');
  try {
    const response = await fetch(smsUrl);
    const text = await response.text();
    console.log('Response status:', response.status);
    console.log('Raw response body:', text);
  } catch (error) {
    console.error('Fetch Error:', error);
  }
}

testSMS();
