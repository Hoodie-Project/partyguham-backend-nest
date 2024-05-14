export class Party {
  constructor(
    public id: number,
    public title: string,
    public content: string,
    public image: string,
    public link: string,
  ) {}

  getId(): Readonly<number> {
    return this.id;
  }
}
