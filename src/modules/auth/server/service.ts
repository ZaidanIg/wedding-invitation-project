import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { ValidationError, ConflictError, NotFoundError, AppError } from '@/lib/errors';
import { authRepository } from './repository';
import { sendCodeSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from './validators';
import { sendVerificationCodeEmail, sendPasswordResetEmail } from '@/lib/email';

function formatZodError(error: any): string {
  return error.errors.map((e: any) => e.message).join(', ');
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

    return { message: 'Kode verifikasi telah dikirim ke email Anda.' };
  },

  async register(payload: unknown) {
    const parsed = registerSchema.safeParse(payload);
    if (!parsed.success) {
      throw new ValidationError(formatZodError(parsed.error));
    }

    const { name, email, password, code } = parsed.data;

    // Check if user already exists
    const existingUser = await authRepository.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictError('User dengan email ini sudah terdaftar.');
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
      message: 'Registrasi berhasil!',
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
    if (!resetToken || resetToken.expires < new Date()) {
      throw new ValidationError('Token reset tidak valid atau sudah kadaluarsa.');
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
