export class Email {
  constructor(readonly value: string) {
    if (!this.isValid(value)) throw new Error("Invalid email");
  }

  private isValid(email: string): boolean {
    return !!email.match(/^(.+)@(.+)$/);
  }
}
