import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';

// Interfaces
import { IUserRepository } from './repositories/interfaces/IUserRepository';
import { IImageRepository } from './repositories/interfaces/IImageRepository';
import { IAuthService } from './services/interfaces/IAuthService';
import { IImageService } from './services/interfaces/IImageService';

// Implementations
import { UserRepository } from './repositories/UserRepository';
import { ImageRepository } from './repositories/ImageRepository';
import { AuthService } from './services/AuthService';
import { ImageService } from './services/ImageService';

// Controllers
import { AuthController } from './controllers/authController';
import { ImageController } from './controllers/imageController';

const container = new Container();

// DAOs (Repositories)
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
container.bind<IImageRepository>(TYPES.IImageRepository).to(ImageRepository);

// Services
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService);
container.bind<IImageService>(TYPES.IImageService).to(ImageService);

// Controllers
container.bind<AuthController>(TYPES.AuthController).to(AuthController);
container.bind<ImageController>(TYPES.ImageController).to(ImageController);

export { container };
