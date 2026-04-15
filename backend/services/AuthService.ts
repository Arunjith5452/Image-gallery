import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { IAuthService } from './interfaces/IAuthService';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { RegisterDto } from '../dtos/RegisterDto';
import { LoginDto } from '../dtos/LoginDto';
import { ResetPasswordDto } from '../dtos/ResetPasswordDto';
import { AuthResponse } from '../interfaces/auth';
import EmailService from '../utils/EmailService';

@injectable()
export class AuthService implements IAuthService {
  private userRepository: IUserRepository;

  constructor(@(inject(TYPES.IUserRepository) as ParameterDecorator) userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  private generateToken(id: string): string {
    const secret = process.env.JWT_SECRET || 'fallback-secret-for-dev-only';
    return jwt.sign({ id }, secret, {
      expiresIn: '30d',
    });
  }

  async register(data: RegisterDto): Promise<AuthResponse> {
    const { email, phone, password } = data;

    if (!email || !phone || !password) {
      throw new Error('Please add all fields');
    }

    const userExists = await this.userRepository.findOne({ email });

    if (userExists) {
      throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await this.userRepository.create({
      email,
      phone,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiry,
    });

    if (user) {
      await EmailService.sendVerificationEmail(email, verificationToken);
      
      return {
        _id: user._id.toString(),
        email: user.email,
        phone: user.phone,
        message: 'Registration successful! Please check your email to verify your account.',
      };
    } else {
      throw new Error('Invalid user data');
    }
  }

  async login(data: LoginDto): Promise<AuthResponse> {
    const { email, password } = data;

    const user = await this.userRepository.findOne({ email });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new Error('Please verify your email before logging in. Check your inbox for the verification link.');
    }

    if (user.password && (await bcrypt.compare(password!, user.password))) {
      const userId = user._id.toString();
      return {
        _id: userId,
        email: user.email,
        phone: user.phone,
        token: this.generateToken(userId),
      };
    } else {
      throw new Error('Invalid credentials');
    }
  }

  async resetPassword(data: ResetPasswordDto): Promise<{ message: string }> {
    const { email, phone, newPassword } = data;

    const user = await this.userRepository.findOne({ email, phone });

    if (!user) {
      throw new Error('User not found or phone mismatch');
    }

    if (!user.isVerified) {
      throw new Error('Please verify your email first');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword!, salt);

    await this.userRepository.updateById(user._id.toString(), { password: hashedPassword });

    return { message: 'Password reset successful' };
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ 
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
      throw new Error('Invalid or expired verification token');
    }

    await this.userRepository.updateById(user._id.toString(), {
      isVerified: true,
      verificationToken: undefined,
      verificationTokenExpiry: undefined,
    });

    return { message: 'Email verified successfully! You can now login.' };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ email });

    if (!user) {
      return { message: 'If an account exists with that email, a password reset link has been sent.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    await this.userRepository.updateById(user._id.toString(), {
      resetPasswordToken: resetToken,
      resetPasswordTokenExpiry: resetTokenExpiry,
    });

    await EmailService.sendPasswordResetEmail(email, resetToken);

    return { message: 'If an account exists with that email, a password reset link has been sent.' };
  }

  async resetPasswordWithToken(token: string, newPassword: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await this.userRepository.updateById(user._id.toString(), {
      password: hashedPassword,
      resetPasswordToken: undefined,
      resetPasswordTokenExpiry: undefined,
    });

    return { message: 'Password reset successful! You can now login with your new password.' };
  }
}
