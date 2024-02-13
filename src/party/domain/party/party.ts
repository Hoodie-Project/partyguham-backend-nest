export class Party {
  constructor(
    public id: number,
    public title: string,
    public content: string,
  ) {}

  getId(): Readonly<number> {
    return this.id;
  }
}
