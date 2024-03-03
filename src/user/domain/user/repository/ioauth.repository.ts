import { OauthEntity } from 'src/user/infra/db/entity/oauth.entity';

export interface IOauthRepository {
  findByExternalId: (account: string) => Promise<OauthEntity>;
  create: (userId: number, externalId: string, platform: string, accessToken: string) => Promise<OauthEntity>;
  update: () => Promise<void>;
}
