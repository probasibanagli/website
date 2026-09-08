/**
 * Webaroo Enterprise Email Gateway Client
 * Uses GatewayAPI/rest with method EMS_POST_CAMPAIGN
 */

export interface WebarooEmailOptions {
  to: string;
  subject: string;
  html: string;
  campaignName?: string;
}

export interface WebarooEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  rawResponse?: string;
}

const DEFAULT_GATEWAY_URL = 'https://enterprise.webaroo.com/GatewayAPI/rest';

/**
 * Parses Webaroo XML response for status and details.
 * Example error response:
 * <response><item><status>error</status><id>106</id><phone/><details>The method "EMS_POST_CAMPAIGN" is not supported.</details><msgId/></item></response>
 */
function parseWebarooResponse(xml: string): { isSuccess: boolean; details?: string; id?: string; msgId?: string } {
  const statusMatch = xml.match(/<status>(.*?)<\/status>/i);
  const detailsMatch = xml.match(/<details>(.*?)<\/details>/i);
  const idMatch = xml.match(/<id>(.*?)<\/id>/i);
  const msgIdMatch = xml.match(/<msgId>(.*?)<\/msgId>/i);

  const status = statusMatch ? statusMatch[1].trim().toLowerCase() : '';
  const details = detailsMatch ? detailsMatch[1].trim() : '';
  const id = idMatch ? idMatch[1].trim() : '';
  const msgId = msgIdMatch ? msgIdMatch[1].trim() : '';

  // Success is either explicit 'success' status or lack of error with a valid msgId/id
  const isSuccess = status === 'success' || (!status.includes('error') && !xml.toLowerCase().includes('<status>error</status>'));

  return {
    isSuccess,
    details: details || (isSuccess ? 'Email submitted successfully' : 'Unknown gateway response'),
    id,
    msgId,
  };
}

/**
 * Sends an email using the Webaroo Enterprise Gateway API (EMS_POST_CAMPAIGN).
 */
export async function sendWebarooEmail({
  to,
  subject,
  html,
  campaignName,
}: WebarooEmailOptions): Promise<WebarooEmailResult> {
  const gatewayUrl = process.env.WEBAROO_GATEWAY_URL || DEFAULT_GATEWAY_URL;
  const userid = process.env.WEBAROO_USERID || '2000xxxx';
  const password = process.env.WEBAROO_PASSWORD || 'password';

  if (!to) {
    return { success: false, error: 'Recipient email is required' };
  }

  const cleanRecipient = to.trim().toLowerCase();
  const name = campaignName || subject || 'PB OTP Verification';

  const formData = new FormData();
  formData.append('method', 'EMS_POST_CAMPAIGN');
  formData.append('userid', userid);
  formData.append('password', password);
  formData.append('recipients', cleanRecipient);
  formData.append('subject', subject);
  formData.append('content', encodeURIComponent(html));
  formData.append('content_type', 'text/html');
  formData.append('auth_scheme', 'PLAIN');
  formData.append('name', name);
  formData.append('v', '1.1');
  formData.append('format', 'xml');
  formData.append('check_duplicate_post', 'true');

  try {
    const response = await fetch(gatewayUrl, {
      method: 'POST',
      body: formData,
    });

    const responseText = await response.text();
    console.log(`[Webaroo Gateway] HTTP Status: ${response.status} | Response: ${responseText}`);

    const parsed = parseWebarooResponse(responseText);

    if (!parsed.isSuccess) {
      console.error(`[Webaroo Gateway] Error sending email to ${cleanRecipient}:`, parsed.details);
      return {
        success: false,
        error: parsed.details,
        rawResponse: responseText,
      };
    }

    console.log(`[Webaroo Gateway] Email sent successfully to ${cleanRecipient}. ID: ${parsed.msgId || parsed.id}`);
    return {
      success: true,
      messageId: parsed.msgId || parsed.id,
      rawResponse: responseText,
    };
  } catch (error: any) {
    console.error(`[Webaroo Gateway] Exception contacting gateway:`, error);
    return {
      success: false,
      error: error.message || 'Failed to contact Webaroo Gateway API',
    };
  }
}
