import '../../helpers/contract.helper';
import { testClient } from '../../setup/testClient';
import { POST as register } from '../../../src/app/api/auth/register/route';
import { POST as sendCode } from '../../../src/app/api/auth/send-code/route';
import { POST as resetPassword } from '../../../src/app/api/auth/reset-password/route';
import { UserFactory } from '../../factories/user.factory';
import { prisma } from '../../../src/lib/prisma';

// We mock the email lib to prevent actual emails from being sent
jest.mock('../../../src/lib/email', () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue(true),
  sendVerificationCodeEmail: jest.fn().mockResolvedValue(true),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(true),
}));

describe('Auth Module Route Tests', () => {
  describe('POST /api/auth/register', () => {
    it('✓ Register success', async () => {
      await prisma.verificationToken.create({
        data: { identifier: 'john@example.com', token: '123456', expires: new Date(Date.now() + 15 * 60 * 1000) }
      });
      const payload = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
        code: '123456',
      };

      const res = await testClient.post(register, 'http://localhost/api/auth/register', payload);
      
      expect(res.status).toBe(201);
      expect(res.body).toMatchApiContract();
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('Selamat Akun Berhasil di buat, silahkan login dengan akun tersebut!');
      
      const user = await prisma.user.findUnique({ where: { email: payload.email } });
      expect(user).not.toBeNull();
      expect(user?.name).toBe(payload.name);
    });

    it('✓ Duplicate email', async () => {
      await UserFactory.create({ email: 'duplicate@example.com' });
      await prisma.verificationToken.create({
        data: { identifier: 'duplicate@example.com', token: '123456', expires: new Date(Date.now() + 15 * 60 * 1000) }
      });

      const payload = {
        name: 'Jane',
        email: 'duplicate@example.com',
        password: 'Password123!',
        code: '123456',
      };

      const res = await testClient.post(register, 'http://localhost/api/auth/register', payload);
      
      expect(res.status).toBe(409);
      expect(res.body).toMatchApiContract();
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('Email yang didaftarkan sudah dipakai, silahkan login dengan email tersebut!');
    });

    it('✓ Invalid email', async () => {
      const payload = {
        name: 'Jane',
        email: 'not-an-email',
        password: 'Password123!',
      };

      const res = await testClient.post(register, 'http://localhost/api/auth/register', payload);
      
      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe('INVALID_EMAIL');
    });

    it('✓ Missing fields', async () => {
      const res = await testClient.post(register, 'http://localhost/api/auth/register', {});
      
      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /api/auth/send-code', () => {
    it('✓ OTP sent', async () => {
      const res = await testClient.post(sendCode, 'http://localhost/api/auth/send-code', { email: 'otp@example.com' });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('Kode verifikasi berhasil terkirim ke email anda');
      
      const token = await prisma.verificationToken.findFirst({ where: { identifier: 'otp@example.com' } });
      expect(token).not.toBeNull();
    });

    it('✓ Invalid email format', async () => {
      const res = await testClient.post(sendCode, 'http://localhost/api/auth/send-code', { email: 'invalid' });
      expect(res.status).toBe(422);
    });
  });

  describe('POST /api/auth/reset-password', () => {
    it('✓ Reset success', async () => {
      await UserFactory.create({ email: 'reset@example.com' });
      await prisma.passwordResetToken.create({
        data: {
          email: 'reset@example.com',
          token: '123456',
          expires: new Date(Date.now() + 1000 * 60 * 15), // 15 mins from now
        }
      });

      const res = await testClient.post(resetPassword, 'http://localhost/api/auth/reset-password', {
        token: '123456',
        password: 'NewPassword123!',
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('✓ Invalid code', async () => {
      await UserFactory.create({ email: 'badcode@example.com' });
      await prisma.passwordResetToken.create({
        data: {
          email: 'badcode@example.com',
          token: '123456',
          expires: new Date(Date.now() + 1000 * 60 * 15),
        }
      });

      const res = await testClient.post(resetPassword, 'http://localhost/api/auth/reset-password', {
        token: '654321', // wrong code
        password: 'NewPassword123!',
      });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('INVALID_CODE');
    });

    it('✓ Expired code', async () => {
      await UserFactory.create({ email: 'expired@example.com' });
      await prisma.passwordResetToken.create({
        data: {
          email: 'expired@example.com',
          token: '123456',
          expires: new Date(Date.now() - 1000 * 60 * 15), // expired 15 mins ago
        }
      });

      const res = await testClient.post(resetPassword, 'http://localhost/api/auth/reset-password', {
        token: '123456',
        password: 'NewPassword123!',
      });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('EXPIRED_CODE');
    });
  });
});
