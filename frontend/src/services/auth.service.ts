import api from '../lib/axios';

class AuthService {
  async register(registrationPayload: any) {
    const response = await api.post('/auth/register', registrationPayload);
    return response.data;
  }

  async login(credentials: any) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  }

  async forgotPassword(email: string) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  }

  async resetPassword(resetPayload: any) {
    const response = await api.post('/auth/reset-password', resetPayload);
    return response.data;
  }

  async resetPasswordWithToken(resetToken: string, newPassword: any) {
    const response = await api.post(`/auth/reset-password/${resetToken}`, { newPassword });
    return response.data;
  }

  async verifyEmail(verificationToken: string) {
    const response = await api.get(`/auth/verify-email/${verificationToken}`);
    return response.data;
  }
}

export const authService = new AuthService();
