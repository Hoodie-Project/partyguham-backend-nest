import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Payload } from './jwt.payload';
import * as crypto from 'crypto';
import { AuthRepository } from './repository/auth.repository';

@Injectable()
export class AuthService {
  private readonly algorithm: string = 'aes-192-cbc';
  private key = process.env.CIPHERIV_KEY_SECRET;
  private iv = process.env.CIPHERIV_IV_SECRET;
  constructor(
    private jwtService: JwtService,
    private authRepository: AuthRepository,
  ) {}

  async createAccessToken(id: string) {
    const payload: Payload = { id };
    return this.jwtService.signAsync(payload, { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '15m' });
  }

  async createRefreshToken(id: string) {
    const payload: Payload = { id };
    return this.jwtService.signAsync(payload, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '30d' });
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

  public decrypt(encryptedData: string) {
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
    let decryptedData = decipher.update(encryptedData, 'base64', 'utf-8');
    decryptedData += decipher.final('utf-8');
    return decryptedData;
  }
}
