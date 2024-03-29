export class Name {
  constructor(readonly value: string) {
    if (!this.isNameValid(value)) throw new Error("Invalid name");
  }

  private isNameValid(name: string): boolean {
    return !!name.match(/[a-zA-Z] [a-zA-Z]+/);
  }
}
