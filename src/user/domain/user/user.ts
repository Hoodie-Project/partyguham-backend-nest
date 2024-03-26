export class User {
  constructor(
    public id: number,
    public nickname: string,
    public email: string,
    public gender: string,
    public birth: string,
  ) {}

  getId(): Readonly<number> {
    return this.id;
  }
}
