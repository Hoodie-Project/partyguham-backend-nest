import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class SignupJwtAuthGuard extends AuthGuard('signup') {}

@Injectable()
export class AccessJwtAuthGuard extends AuthGuard('access') {}

@Injectable()
export class RefreshJwtAuthGuard extends AuthGuard('refresh') {}

@Injectable()
export class OptionalAccessJwtAuthGuard extends AuthGuard('access') {
  handleRequest(err, user, info, context) {
    // user은 'OptionalAccessStrategy'를 통한 결과값 반환
    if (!user) {
      // 토큰이 없거나 잘못된 경우 null 반환
      return { id: null };
    }

    // 토큰이 유효하면 user 반환
    return user;
  }
}
