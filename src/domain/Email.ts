export class Email {
  constructor(readonly value: string) {
    if (!this.isEmailValid(value)) throw new Error("Invalid email");
  }

  private isEmailValid(email: string): boolean {
    return !!email.match(/^(.+)@(.+)$/);
  }
}
