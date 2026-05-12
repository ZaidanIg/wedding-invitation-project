import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_FROM || 'WeddingAI <noreply@weddingai.com>',
    to: email,
    subject: 'Verify your email address - WeddingAI',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
        <h2 style="color: #e11d48; text-align: center;">Welcome to WeddingAI!</h2>
        <p style="font-size: 16px; color: #333;">Hi there,</p>
        <p style="font-size: 16px; color: #333;">Thank you for registering. To complete your registration and unlock all features, please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #e11d48; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Verify Email</a>
        </div>
        <p style="font-size: 14px; color: #666;">Or copy and paste this link into your browser:</p>
        <p style="font-size: 14px; color: #e11d48; word-break: break-all;">${verificationUrl}</p>
        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999; text-align: center;">If you didn't create an account, you can safely ignore this email.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

export const sendVerificationCodeEmail = async (email: string, code: string) => {
  const mailOptions = {
    from: process.env.SMTP_FROM || 'WeddingAI <noreply@weddingai.com>',
    to: email,
    subject: 'Your Verification Code - WeddingAI',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
        <h2 style="color: #e11d48; text-align: center;">WeddingAI Verification</h2>
        <p style="font-size: 16px; color: #333;">Hi there,</p>
        <p style="font-size: 16px; color: #333;">Your 6-digit verification code is:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="background-color: #f3f4f6; color: #111827; padding: 16px 32px; border-radius: 8px; font-weight: bold; font-size: 32px; letter-spacing: 4px;">${code}</span>
        </div>
        <p style="font-size: 14px; color: #666;">This code will expire in 15 minutes.</p>
        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999; text-align: center;">If you didn't request this code, you can safely ignore this email.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification code email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending verification code email:', error);
    return false;
  }
};
