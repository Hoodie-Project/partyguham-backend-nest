import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { OauthService } from './oauth.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class AuthService {
  private readonly algorithm: string = 'aes-256-cbc';
  private readonly key = process.env.CIPHERIV_KEY_SECRET;
  private readonly iv = process.env.CIPHERIV_IV_SECRET;

  private readonly appKey = process.env.APP_CIPHERIV_KEY_SECRET;
  private readonly appIv = process.env.APP_CIPHERIV_IV_SECRET;

  private readonly TTL_SECONDS = 30 * 24 * 60 * 60; // 30일
  constructor(
    private jwtService: JwtService,
    private oauthService: OauthService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async createSignupToken(oauthId: number, email: string, image: string) {
    const createPayload = { sub: oauthId, email, image };
    return this.jwtService.signAsync(createPayload, {
      secret: process.env.JWT_SIGNUP_SECRET,
      expiresIn: '1h',
      algorithm: 'HS256',
    });
  }

  async createRecoverToken(userExternalId: string) {
    const createPayload = { sub: userExternalId };

    return this.jwtService.signAsync(createPayload, {
      secret: process.env.JWT_RECOVER_SECRET,
      expiresIn: '5m',
      algorithm: 'HS256',
    });
  }

  async createAccessToken(userExternalId: string) {
    const createPayload = { sub: userExternalId };

    return this.jwtService.signAsync(createPayload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.MODE === 'prod' ? '15m' : '1y',
      algorithm: 'HS512',
    });
  }

  async createRefreshToken(userExternalId: string) {
    const createPayload = { sub: userExternalId };

    const refreshToken = await this.jwtService.signAsync(createPayload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '30d',
      algorithm: 'HS512',
    });

    // Redis에 저장

    return refreshToken;
  }

  async validateSignupAccessToken(token: string): Promise<any> {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SIGNUP_SECRET,
      algorithms: ['HS256'],
    });

    // 추가적인 검증 로직 (예: 유저 확인, 특정 조건 등)
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const oauth = await this.oauthService.findById(payload.sub);

    if (oauth.userId) {
      throw new ConflictException('이미 회원가입이 되어있는 계정입니다.');
    }

    return oauth.id;
  }

  // Redis Refresh Token 관리

  /** 토큰 저장 */
  async saveRefreshToken(userId: number, device: 'web' | 'app', token: string) {
    const mainKey = `refresh:${userId}:${device}`;

    await this.redis.set(mainKey, token, 'EX', this.TTL_SECONDS);
  }

  /** 토큰 검증 */
  async validateRefreshToken(userId: number, device: 'web' | 'app', token: string): Promise<boolean> {
    const key = `refresh:${userId}:${device}`;
    const stored = await this.redis.get(key); // 만료되면 null

    return stored !== null && stored === token; // 값 일치 + 키 살아있음
  }

  // 기기 하나만 무효화
  async revokeRefreshToken(userId: number, device: 'web' | 'app') {
    await this.redis.del(`refresh:${userId}:${device}`);
  }

  // 유저 전체(웹+앱) 무효화
  async revokeAllRefreshTokens(userId: number) {
    await this.redis.del(`refresh:${userId}:web`, `refresh:${userId}:app`);
  }

  // async encrypt(data: string) {
  //   const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
  //   let result = cipher.update(data, 'utf-8', 'base64');
  //   result += cipher.final('base64');
  //   return result;
  // }

  // public decrypt(data: string) {
  //   const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
  //   let result = decipher.update(data, 'base64', 'utf-8');
  //   result += decipher.final('utf-8');
  //   return result;
  // }

  // async appEncrypt(data: string) {
  //   const cipher = crypto.createCipheriv(this.algorithm, this.appKey, this.appIv);
  //   let result = cipher.update(data, 'utf-8', 'base64');
  //   result += cipher.final('base64');
  //   return result;
  // }

  // public appDecrypt(data: string) {
  //   const decipher = crypto.createDecipheriv(this.algorithm, this.appKey, this.appIv);
  //   let result = decipher.update(data, 'base64', 'utf-8');
  //   result += decipher.final('utf-8');
  //   return result;
  // }
}
