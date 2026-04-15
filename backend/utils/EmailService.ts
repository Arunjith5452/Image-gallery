import nodemailer from 'nodemailer';

class EmailService {
  private createTransporter(): nodemailer.Transporter {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
      throw new Error('Email configuration is missing. Check EMAIL_USER and EMAIL_PASS in backend/.env');
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587', 10),
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
  }

  async sendVerificationEmail(email: string, verificationToken: string): Promise<void> {
    const transporter = this.createTransporter();
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email/${verificationToken}`;
    const fromEmail = process.env.EMAIL_USER as string;

    const mailOptions = {
      from: fromEmail,
      to: email,
      subject: 'Verify Your Email - ImageGallery',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Welcome to ImageGallery!</h2>
          <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
          <a href="${verificationUrl}" 
             style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">
            Verify Email
          </a>
          <p style="color: #6b7280; font-size: 14px;">Or copy and paste this link into your browser:</p>
          <p style="color: #3b82f6; word-break: break-all;">${verificationUrl}</p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">This link will expire in 24 hours.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin-top: 30px;">
          <p style="color: #9ca3af; font-size: 12px;">If you didn't create an account, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const transporter = this.createTransporter();
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
    const fromEmail = process.env.EMAIL_USER as string;

    const mailOptions = {
      from: fromEmail,
      to: email,
      subject: 'Reset Your Password - ImageGallery',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">Password Reset Request</h2>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <a href="${resetUrl}" 
             style="display: inline-block; padding: 12px 24px; background-color: #ef4444; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">
            Reset Password
          </a>
          <p style="color: #6b7280; font-size: 14px;">Or copy and paste this link into your browser:</p>
          <p style="color: #ef4444; word-break: break-all;">${resetUrl}</p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">This link will expire in 1 hour.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin-top: 30px;">
          <p style="color: #9ca3af; font-size: 12px;">If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  }
}

export default new EmailService();
