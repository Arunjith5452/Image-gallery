import express from 'express';
import { container } from '../inversify.config';
import { TYPES } from '../types';
import { AuthController } from '../controllers/authController';
import { validateDto } from '../middleware/validationMiddleware';
import { RegisterDto } from '../dtos/RegisterDto';
import { LoginDto } from '../dtos/LoginDto';
import { ResetPasswordDto } from '../dtos/ResetPasswordDto';

const router = express.Router();

const authController = container.get<AuthController>(TYPES.AuthController);

router.post('/register', validateDto(RegisterDto), authController.registerUser);
router.post('/login', validateDto(LoginDto), authController.loginUser);
router.post('/reset-password', validateDto(ResetPasswordDto), authController.resetPassword);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPasswordWithToken);

export default router;
