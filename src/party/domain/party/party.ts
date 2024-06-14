export class Party {
  constructor(
    public id: number,
    public title: string,
    public content: string,
    public image: string,
  ) {}

  getId(): Readonly<number> {
    return this.id;
  }

  updateFields(title: string | undefined, content: string | undefined, image: string | undefined): void {
    if (title !== undefined) {
      this.title = title;
    }
    if (content !== undefined) {
      this.content = content;
    }
    if (image !== undefined) {
      this.image = image;
    }
  }
}
