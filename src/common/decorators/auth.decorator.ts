import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request: Request = ctx.switchToHttp().getRequest();
  return request.user;
});

export type CurrentUserType = { userId: number | null }; // access token
export type CurrentRefreshType = { userExternalId: string }; // refresh token
export type CurrentRecoverType = { userId: number; userExternalId: string }; // recover token
export type CurrentSignupType = { oauthId: number; email: string; image: string };
