export const TYPES = {
  IUserRepository: Symbol.for('IUserRepository'),
  IImageRepository: Symbol.for('IImageRepository'),
  IAuthService: Symbol.for('IAuthService'),
  IImageService: Symbol.for('IImageService'),
  AuthController: Symbol.for('AuthController'),
  ImageController: Symbol.for('ImageController'),
} as const;
