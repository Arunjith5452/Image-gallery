export interface RegisterDto {
  email: string;
  phone: string;
  password?: string;
}

export interface LoginDto {
  email: string;
  password?: string;
}

export interface ResetPasswordDto {
  email: string;
  phone: string;
  newPassword?: string;
}

export interface AuthResponse {
  _id: string;
  email: string;
  phone: string;
  token: string;
  message?: string;
}
