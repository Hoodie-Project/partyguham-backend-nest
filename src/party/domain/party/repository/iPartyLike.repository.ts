export interface IPartyLikeRepository {
  create: (userId: number, partyId: number) => Promise<void>;
  delete: (userId: number, partyId: number) => Promise<boolean>;
}
