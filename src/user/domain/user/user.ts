export class User {
  constructor(
    public id: number,
    public account: string, 
    public nickname: string,
    public email: string,
    public gender: string,
    public birth: Date,
  ) {}

  getId(): Readonly<number> {
    return this.id;
  }
}
