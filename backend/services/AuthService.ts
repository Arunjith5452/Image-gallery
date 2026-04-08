import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { IAuthService } from './interfaces/IAuthService';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { RegisterDto } from '../dtos/RegisterDto';
import { LoginDto } from '../dtos/LoginDto';
import { ResetPasswordDto } from '../dtos/ResetPasswordDto';
import { AuthResponse } from '../interfaces/auth';

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

    const user = await this.userRepository.create({
      email,
      phone,
      password: hashedPassword,
    });

    if (user) {
      const userId = user._id.toString();
      return {
        _id: userId,
        email: user.email,
        phone: user.phone,
        token: this.generateToken(userId),
      };
    } else {
      throw new Error('Invalid user data');
    }
  }

  async login(data: LoginDto): Promise<AuthResponse> {
    const { email, password } = data;

    const user = await this.userRepository.findOne({ email });

    if (user && user.password && (await bcrypt.compare(password!, user.password))) {
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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword!, salt);

    await this.userRepository.updateById(user._id.toString(), { password: hashedPassword });

    return { message: 'Password reset successful' };
  }
}
