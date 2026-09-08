require('dotenv').config({ path: '.env.local' });

async function testWebarooEmail() {
  const gatewayUrl = process.env.WEBAROO_GATEWAY_URL || 'https://enterprise.webaroo.com/GatewayAPI/rest';
  const userid = process.env.WEBAROO_USERID || '2000xxxx';
  const password = process.env.WEBAROO_PASSWORD || 'password';
  const recipient = process.argv[2] || 'cc@messagewall.in';

  console.log('Testing Webaroo Gateway API with:');
  console.log('Gateway URL:', gatewayUrl);
  console.log('User ID:', userid);
  console.log('Password length:', password.length);
  console.log('Recipient:', recipient);

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px; max-width: 500px;">
      <h2 style="color: #D85A30; text-align: center;">Email Verification Code</h2>
      <p>Hello,</p>
      <p>Your 6-digit verification code is:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 28px; font-weight: bold; letter-spacing: 5px; background: #f7f7f7; padding: 10px 20px; border-radius: 5px; border: 1px dashed #ccc; color: #333;">
          ${otpCode}
        </span>
      </div>
      <p style="color: #666; font-size: 12px;">This OTP is valid for <strong>5 minutes</strong>.</p>
    </div>
  `;

  const formData = new FormData();
  formData.append('method', 'EMS_POST_CAMPAIGN');
  formData.append('userid', userid);
  formData.append('password', password);
  formData.append('recipients', recipient);
  formData.append('subject', 'TEST EMAIL OTP');
  formData.append('content', encodeURIComponent(emailHtml));
  formData.append('content_type', 'text/html');
  formData.append('auth_scheme', 'PLAIN');
  formData.append('name', 'TEST EMAIL');
  formData.append('v', '1.1');
  formData.append('format', 'xml');
  formData.append('check_duplicate_post', 'true');

  try {
    console.log('Sending request to Webaroo Gateway API...');
    const response = await fetch(gatewayUrl, {
      method: 'POST',
      body: formData,
    });

    const responseText = await response.text();
    console.log('HTTP Status:', response.status);
    console.log('Raw Gateway Response:');
    console.log(responseText);

    const isError = responseText.toLowerCase().includes('<status>error</status>');
    if (isError) {
      console.warn('\nGateway returned an error response.');
      console.warn('Note: If credentials (userid/password) are placeholders (2000xxxx), please update them in .env.local with your active Webaroo account details.');
    } else {
      console.log('\nSuccess! Gateway accepted the email campaign request.');
    }
  } catch (error) {
    console.error('Network/Execution Error:', error);
  }
}

testWebarooEmail();
