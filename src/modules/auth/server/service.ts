import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { ValidationError, ConflictError, NotFoundError, AppError } from '@/lib/errors';
import { authRepository } from './repository';
import { sendCodeSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from './validators';
import { sendVerificationCodeEmail, sendPasswordResetEmail } from '@/lib/email';

function formatZodError(error: any): string {
  if (error?.issues && Array.isArray(error.issues)) {
    return error.issues.map((e: any) => e.message).join(', ');
  }
  if (error?.errors && Array.isArray(error.errors)) {
    return error.errors.map((e: any) => e.message).join(', ');
  }
  return 'Data tidak valid';
}

export const authService = {
  async sendCode(payload: unknown) {
    const parsed = sendCodeSchema.safeParse(payload);
    if (!parsed.success) {
      throw new ValidationError(formatZodError(parsed.error));
    }

    const { email } = parsed.data;

    // Check if user already exists
    const existingUser = await authRepository.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictError('User dengan email ini sudah terdaftar.');
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Delete any existing tokens to prevent duplicates
    await authRepository.deleteVerificationTokens(email);

    // Save new code
    await authRepository.createVerificationToken({
      identifier: email,
      token: code,
      expires,
    });

    try {
      await sendVerificationCodeEmail(email, code);
    } catch (error: any) {
      throw new AppError(`Email System Error: ${error.message}`, 500, 'EMAIL_ERROR');
    }

    return { message: 'Kode verifikasi berhasil terkirim ke email anda' };
  },

  async register(payload: unknown) {
    const parsed = registerSchema.safeParse(payload);
    if (!parsed.success) {
      const msg = formatZodError(parsed.error);
      const isInvalidEmail = parsed.error.issues.some((issue) => issue.message === 'Masukan format email yang valid!');
      const errorCode = isInvalidEmail ? 'INVALID_EMAIL' : 'VALIDATION_ERROR';
      throw new AppError(msg, 422, errorCode);
    }

    const { name, email, password, code } = parsed.data;

    // Check if user already exists
    const existingUser = await authRepository.findUserByEmail(email);
    if (existingUser) {
      throw new AppError('Email yang didaftarkan sudah dipakai, silahkan login dengan email tersebut!', 409, 'Email yang didaftarkan sudah dipakai, silahkan login dengan email tersebut!');
    }

    // Verify code
    const verificationToken = await authRepository.findVerificationToken(email, code);
    if (!verificationToken) {
      throw new ValidationError('Kode verifikasi tidak valid.');
    }

    if (verificationToken.expires < new Date()) {
      throw new ValidationError('Kode verifikasi sudah kadaluarsa. Silakan minta kode baru.');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user & verify email immediately
    const user = await authRepository.createUser({
      name,
      email,
      password: hashedPassword,
      emailVerified: new Date(),
    });

    // Delete the used token
    await authRepository.deleteVerificationToken(email, code);

    return {
      message: 'Selamat Akun Berhasil di buat, silahkan login dengan akun tersebut!',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  },

  async forgotPassword(payload: unknown) {
    const parsed = forgotPasswordSchema.safeParse(payload);
    if (!parsed.success) {
      throw new ValidationError(formatZodError(parsed.error));
    }

    const { email } = parsed.data;

    const user = await authRepository.findUserByEmail(email);

    // Securely return success message even if email is not found to prevent user enumeration
    if (!user || !user.password) {
      return { message: 'Jika email terdaftar, instruksi reset akan dikirim.' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await authRepository.createPasswordResetToken({
      email,
      token,
      expires,
    });

    const emailSent = await sendPasswordResetEmail(email, token);
    if (!emailSent) {
      throw new Error('Gagal mengirimkan email reset kata sandi.');
    }

    return { message: 'Email reset kata sandi telah dikirim.' };
  },

  async resetPassword(payload: unknown) {
    const parsed = resetPasswordSchema.safeParse(payload);
    if (!parsed.success) {
      throw new ValidationError(formatZodError(parsed.error));
    }

    const { token, password } = parsed.data;

    const resetToken = await authRepository.findPasswordResetToken(token);
    if (!resetToken) {
      throw new AppError('Token reset tidak valid.', 400, 'INVALID_CODE');
    }
    if (resetToken.expires < new Date()) {
      throw new AppError('Token reset sudah kadaluarsa.', 400, 'EXPIRED_CODE');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password
    await authRepository.updateUserPassword(resetToken.email, hashedPassword);

    // Delete token
    await authRepository.deletePasswordResetToken(resetToken.id);

    return { message: 'Kata sandi berhasil diperbarui.' };
  },
};
