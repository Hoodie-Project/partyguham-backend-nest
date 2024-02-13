export class Follow {
  constructor(
    public userId: number,
    public followId: number,
  ) {}

  getUserId(): Readonly<number> {
    return this.userId;
  }

  getFollowId(): Readonly<number> {
    return this.followId;
  }
}
