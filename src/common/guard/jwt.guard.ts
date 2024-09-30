import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class WebSignupJwtAuthGuard extends AuthGuard('webSignup') {}

@Injectable()
export class AppSignupJwtAuthGuard extends AuthGuard('appSignup') {}

@Injectable()
export class AccessJwtAuthGuard extends AuthGuard('access') {}

@Injectable()
export class RefreshJwtAuthGuard extends AuthGuard('refresh') {}
