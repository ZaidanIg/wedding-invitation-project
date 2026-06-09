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
    from: process.env.SMTP_FROM || 'Sahinaja <official@sahinaja.com>',
    to: email,
    subject: 'Verify your email address - Sahinaja',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
        <h2 style="color: #e11d48; text-align: center;">Welcome to Sahinaja!</h2>
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
    from: process.env.SMTP_FROM || 'Sahinaja <official@sahinaja.com>',
    to: email,
    subject: 'Your Verification Code - Sahinaja',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
        <h2 style="color: #e11d48; text-align: center;">Sahinaja Verification</h2>
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
  } catch (error: unknown) {
    console.error('Error sending verification code email:', error);
    throw new Error(`SMTP Error: ${(error as Error).message || 'Unknown SMTP Error'}`);
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_FROM || 'Sahinaja <official@sahinaja.com>',
    to: email,
    subject: 'Reset your password - Sahinaja',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
        <h2 style="color: #e11d48; text-align: center;">Reset Password</h2>
        <p style="font-size: 16px; color: #333;">Hi,</p>
        <p style="font-size: 16px; color: #333;">Kami menerima permintaan untuk mereset kata sandi akun Sahinaja Anda. Klik tombol di bawah ini untuk melanjutkan:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #e11d48; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Reset Kata Sandi</a>
        </div>
        <p style="font-size: 14px; color: #666;">Atau salin link berikut ke browser Anda:</p>
        <p style="font-size: 14px; color: #e11d48; word-break: break-all;">${resetUrl}</p>
        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999; text-align: center;">Jika Anda tidak merasa meminta reset kata sandi, silakan abaikan email ini.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
};

export const sendInvoiceEmail = async (email: string, invoiceDetails: {
  orderId: string;
  planName: string;
  subtotal: number;
  ppn: number;
  adminFee: number;
  total: number;
  coupleNames: string;
}) => {
  const mailOptions = {
    from: process.env.SMTP_FROM || 'Sahinaja <official@sahinaja.com>',
    to: email,
    subject: `Bukti Pembayaran Sukses — Sahinaja #${invoiceDetails.orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eaeaea; border-radius: 20px; background-color: #fcfbf8;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #e11d48; margin: 0; font-size: 28px;">Sahinaja</h1>
          <p style="color: #666; font-size: 14px; margin: 5px 0 0 0;">Bukti Transaksi Resmi</p>
        </div>
        
        <div style="background-color: white; border: 1px solid #eceae4; padding: 20px; border-radius: 15px; margin-bottom: 25px;">
          <h3 style="margin-top: 0; color: #111; border-bottom: 1px solid #eee; padding-bottom: 10px;">Ringkasan Pembayaran</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; color: #666;">Nomor Order:</td>
              <td style="padding: 6px 0; font-weight: bold; text-align: right; color: #111;">${invoiceDetails.orderId}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #666;">Paket Layanan:</td>
              <td style="padding: 6px 0; font-weight: bold; text-align: right; color: #e11d48;">${invoiceDetails.planName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #666;">Nama Pasangan:</td>
              <td style="padding: 6px 0; font-weight: bold; text-align: right; color: #111;">${invoiceDetails.coupleNames}</td>
            </tr>
            <tr>
              <td colspan="2"><hr style="border: none; border-top: 1px dashed #eee; margin: 10px 0;" /></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #666;">Subtotal:</td>
              <td style="padding: 6px 0; font-weight: bold; text-align: right; color: #111;">Rp ${invoiceDetails.subtotal.toLocaleString('id-ID')}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #666;">PPN (11%):</td>
              <td style="padding: 6px 0; font-weight: bold; text-align: right; color: #111;">Rp ${invoiceDetails.ppn.toLocaleString('id-ID')}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #666;">Biaya Admin & Layanan:</td>
              <td style="padding: 6px 0; font-weight: bold; text-align: right; color: #111;">Rp ${invoiceDetails.adminFee.toLocaleString('id-ID')}</td>
            </tr>
            <tr>
              <td colspan="2"><hr style="border: none; border-top: 1px solid #eee; margin: 10px 0;" /></td>
            </tr>
            <tr style="font-size: 16px; font-weight: bold;">
              <td style="padding: 6px 0; color: #111;">Total Pembayaran:</td>
              <td style="padding: 6px 0; text-align: right; color: #e11d48;">Rp ${invoiceDetails.total.toLocaleString('id-ID')}</td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; color: #666; font-size: 12px; line-height: 1.5;">
          <p>Terima kasih atas kepercayaan Anda menggunakan Sahinaja untuk mengabadikan momen terindah hidup Anda.</p>
          <p>Jika ada pertanyaan, hubungi kami di <a href="mailto:official@sahinaja.com" style="color: #e11d48; text-decoration: none;">official@sahinaja.com</a>.</p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
          <p style="color: #999;">📍 Jln. Pager betis dsn, Jl. Tenjolaya No.15, RT.03/RW.01, Sukagalih, Kec. Sumedang selatan, Kabupaten Sumedang, Jawa Barat 45311</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Invoice email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending invoice email:', error);
    return false;
  }
};
