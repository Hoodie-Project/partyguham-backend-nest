import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { AuthRepository } from './repository/auth.repository';

@Injectable()
export class AuthService {
  private readonly algorithm: string = 'aes-256-cbc';
  private readonly key = process.env.CIPHERIV_KEY_SECRET;
  private readonly iv = process.env.CIPHERIV_IV_SECRET;

  private readonly appKey = process.env.APP_CIPHERIV_KEY_SECRET;
  private readonly appIv = process.env.APP_CIPHERIV_IV_SECRET;
  constructor(
    private jwtService: JwtService,
    private authRepository: AuthRepository,
  ) {}

  async signupAccessToken(id: string) {
    const createPayload = { id };
    return this.jwtService.signAsync(createPayload, {
      secret: process.env.JWT_SIGNUP_SECRET,
      expiresIn: '1h',
      algorithm: 'HS256',
    });
  }

  async createAccessToken(id: string) {
    const createPayload = { id };
    return this.jwtService.signAsync(createPayload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.MODE === 'prod' ? '15m' : '1y',
      algorithm: 'HS512',
    });
  }

  async createRefreshToken(id: string) {
    const createPayload = { id };
    return this.jwtService.signAsync(createPayload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '30d',
      algorithm: 'HS512',
    });
  }

  async findRefreshToken(userId: number, refreshToken: string) {
    const result = this.authRepository.findRefreshToken(userId, refreshToken);

    return result;
  }

  async saveRefreshToken(id: number, token: string) {
    this.authRepository.saveRefreshToken(id, token);
  }

  async encrypt(data: string) {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    let result = cipher.update(data, 'utf-8', 'base64');
    result += cipher.final('base64');
    return result;
  }

  public decrypt(data: string) {
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
    let result = decipher.update(data, 'base64', 'utf-8');
    result += decipher.final('utf-8');
    return result;
  }

  async appEncrypt(data: string) {
    const cipher = crypto.createCipheriv(this.algorithm, this.appKey, this.appIv);
    let result = cipher.update(data, 'utf-8', 'base64');
    result += cipher.final('base64');
    return result;
  }

  public appDecrypt(data: string) {
    const decipher = crypto.createDecipheriv(this.algorithm, this.appKey, this.appIv);
    let result = decipher.update(data, 'base64', 'utf-8');
    result += decipher.final('utf-8');
    return result;
  }
}
