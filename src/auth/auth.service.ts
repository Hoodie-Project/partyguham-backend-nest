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

  // Refresh Token 관리
  /** 토큰 조회 */
  async getRefreshToken(userId: number): Promise<string | null> {
    const token = await this.redis.get(`refresh:${userId}`);
    return token; // 없으면 null 반환
  }

  /** 토큰 저장 */
  async saveRefreshToken(userExternalId: string, device: 'web' | 'app', token: string) {
    const mainKey = `refresh:${userExternalId}`;
    const member = `${device}:${token}`;
    const ttlKey = `rtx:${userExternalId}:${device}:${token}`;

    // 1) Set에 추가
    await this.redis.sadd(mainKey, member);

    // 2) TTL용 더미 키 추가
    await this.redis.set(ttlKey, 'active', 'EX', this.TTL_SECONDS);
  }

  /** 토큰 검증 */
  async validateRefreshToken(userExternalId: string, device: 'web' | 'app', token: string): Promise<boolean> {
    const member = `${device}:${token}`;
    const ttlKey = `rtx:${userExternalId}:${device}:${token}`;

    // Set에 포함 && TTL 키가 살아있으면 유효
    const isMember = await this.redis.sismember(`refresh:${userExternalId}`, member);
    const exists = await this.redis.exists(ttlKey);

    return isMember === 1 && exists === 1;
  }

  /** 토큰 삭제 */
  async deleteRefreshToken(userId: number, device: 'web' | 'app', token: string) {
    const member = `${device}:${token}`;
    const ttlKey = `rtx:${userId}:${device}:${token}`;

    await this.redis.srem(`refresh:${userId}`, member);
    await this.redis.del(ttlKey);
  }

  /** 유저의 모든 토큰 조회 */
  async getUserTokens(userId: number): Promise<string[]> {
    return await this.redis.smembers(`refresh:${userId}`);
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
