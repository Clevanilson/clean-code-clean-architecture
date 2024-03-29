export class Name {
  constructor(readonly value: string) {
    if (!this.isValid(value)) throw new Error("Invalid name");
  }

  private isValid(name: string): boolean {
    return !!name.match(/[a-zA-Z] [a-zA-Z]+/);
  }
}
