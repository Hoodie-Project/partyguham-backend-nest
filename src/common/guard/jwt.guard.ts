import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class SignupJwtAuthGuard extends AuthGuard('signup') {}

@Injectable()
export class AccessJwtAuthGuard extends AuthGuard('access') {}

@Injectable()
export class RefreshJwtAuthGuard extends AuthGuard('refresh') {}

@Injectable()
export class OptionalAccessJwtAuthGuard extends AuthGuard('optional-access') {
  handleRequest(err, user, info, context) {
    // 토큰이 없는 경우도 통과시키기 위해 null 반환
    if (err || !user) {
      return null; // 로그인되지 않은 상태로 처리
    }
    return user; // 로그인된 사용자 정보 반환
  }
}
