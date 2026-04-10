import { RegisterDto } from '../../dtos/RegisterDto';
import { LoginDto } from '../../dtos/LoginDto';
import { ResetPasswordDto } from '../../dtos/ResetPasswordDto';
import { AuthResponse } from '../../interfaces/auth';

export interface IAuthService {
  register(data: RegisterDto): Promise<AuthResponse>;
  login(data: LoginDto): Promise<AuthResponse>;
  resetPassword(data: ResetPasswordDto): Promise<{ message: string }>;
  verifyEmail(token: string): Promise<{ message: string }>;
  forgotPassword(email: string): Promise<{ message: string }>;
  resetPasswordWithToken(token: string, newPassword: string): Promise<{ message: string }>;
}
