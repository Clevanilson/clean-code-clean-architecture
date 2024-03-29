import crypto from "crypto";
import { validateCpf } from "./validateCpf";

export class Account {
  accountId: string;
  name: string;
  email: string;
  cpf: string;
  carPlate?: string;
  isPassenger: boolean;
  isDriver: boolean;

  private constructor(
    accountId: string,
    name: string,
    email: string,
    cpf: string,
    isPassenger: boolean,
    isDriver: boolean,
    carPlate?: string
  ) {
    if (!this.isNameValid(name)) throw new Error("Invalid name");
    if (!this.isEmailValid(email)) throw new Error("Invalid email");
    if (!validateCpf(cpf)) throw new Error("Invalid CPF");
    if (isDriver && !this.isCarPlateValid(carPlate))
      throw new Error("Invalid car plate");
    this.accountId = accountId;
    this.name = name;
    this.email = email;
    this.cpf = cpf;
    this.isDriver = isDriver;
    this.isPassenger = isPassenger;
    this.carPlate = carPlate;
  }

  static create(
    name: string,
    email: string,
    cpf: string,
    isPassenger: boolean,
    isDriver: boolean,
    carPlate?: string
  ): Account {
    const accountId = crypto.randomUUID();
    return new Account(
      accountId,
      name,
      email,
      cpf,
      isPassenger,
      isDriver,
      carPlate
    );
  }

  static restore(
    accountId: string,
    name: string,
    email: string,
    cpf: string,
    isPassenger: boolean,
    isDriver: boolean,
    carPlate?: string
  ): Account {
    return new Account(
      accountId,
      name,
      email,
      cpf,
      isPassenger,
      isDriver,
      carPlate
    );
  }

  private isNameValid(name: string): boolean {
    return !!name.match(/[a-zA-Z] [a-zA-Z]+/);
  }

  private isEmailValid(email: string): boolean {
    return !!email.match(/^(.+)@(.+)$/);
  }

  private isCarPlateValid(carPlate?: string): boolean {
    return !!carPlate?.match(/[A-Z]{3}[0-9]{4}/);
  }
}
