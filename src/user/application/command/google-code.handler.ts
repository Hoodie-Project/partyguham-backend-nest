import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GoogleCodeCommand } from './google-code.command';

@Injectable()
@CommandHandler(GoogleCodeCommand)
export class GoogleCodeHandler implements ICommandHandler<GoogleCodeCommand> {
  constructor() {}

  async execute({}: GoogleCodeCommand) {
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleRedirectURL = process.env.GOOGLE_REDIRECT_URI;
    return `https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A//www.googleapis.com/auth/drive.metadata.readonly&response_type=code&&redirect_uri=${googleRedirectURL}&client_id=${googleClientId}`;
  }
}
