import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class SignupJwtAuthGuard extends AuthGuard('signup') {}

@Injectable()
export class AccessJwtAuthGuard extends AuthGuard('access') {}

@Injectable()
export class RefreshJwtAuthGuard extends AuthGuard('refresh') {}
