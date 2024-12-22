import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GoogleLinkCodeCommand } from './googleLink-code.command';

@Injectable()
@CommandHandler(GoogleLinkCodeCommand)
export class GoogleLinkCodeHandler implements ICommandHandler<GoogleLinkCodeCommand> {
  constructor() {}

  async execute({}: GoogleLinkCodeCommand) {
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleRedirectURL = process.env.GOOGLE_LINK_REDIRECT_URI;

    const authURL =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `scope=https://www.googleapis.com/auth/userinfo.email+https://www.googleapis.com/auth/userinfo.profile&` +
      `access_type=offline&` +
      `include_granted_scopes=true&` +
      `response_type=code&` +
      `state=state_parameter_passthrough_value&` +
      `redirect_uri=${googleRedirectURL}&` +
      `client_id=${googleClientId}`;

    return authURL;
  }
}
