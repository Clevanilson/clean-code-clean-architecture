import crypto from "crypto";
import { validateCpf } from "@/domain/validateCpf";
import { Name } from "@/domain//Name";
import { Email } from "@/domain/Email";

export class Account {
  private email: Email;
  private name: Name;
  accountId: string;
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
    if (!validateCpf(cpf)) throw new Error("Invalid CPF");
    if (isDriver && !this.isCarPlateValid(carPlate))
      throw new Error("Invalid car plate");
    this.accountId = accountId;
    this.email = new Email(email);
    this.name = new Name(name);
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

  getName(): string {
    return this.name.value;
  }

  getEmail(): string {
    return this.email.value;
  }

  private isCarPlateValid(carPlate?: string): boolean {
    return !!carPlate?.match(/[A-Z]{3}[0-9]{4}/);
  }
}
