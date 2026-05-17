export async function sendWhatsAppMessage(to: string, message: string, customApiKey?: string) {
  const apiKey = customApiKey || process.env.FONNTE_API_TOKEN;
  if (!apiKey) {
    throw new Error('WhatsApp gateway token is not configured');
  }

  // Format phone number to international standard (62)
  let cleanPhone = to.replace(/\D/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.substring(1);
  } else if (cleanPhone.startsWith('8')) {
    cleanPhone = '62' + cleanPhone;
  } else if (!cleanPhone.startsWith('62') && cleanPhone.length > 0) {
    cleanPhone = '62' + cleanPhone;
  }

  if (!cleanPhone) {
    throw new Error('Invalid target phone number');
  }

  const response = await fetch('https://api.fonnte.com/send', {
    method: 'POST',
    headers: {
      'Authorization': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      target: cleanPhone,
      message: message,
      countryCode: '62',
    }),
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error(`Invalid gateway response: ${text.substring(0, 100)}`);
  }

  if (!response.ok || !data.status) {
    throw new Error(data.reason || 'Failed to send WhatsApp message via gateway');
  }

  return data;
}
