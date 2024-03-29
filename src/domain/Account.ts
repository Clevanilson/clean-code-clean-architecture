import crypto from "crypto";
import { Name } from "@/domain//Name";
import { Email } from "@/domain/Email";
import { CPF } from "@/domain/CPF";

export class Account {
  private cpf: CPF;
  private email: Email;
  private name: Name;
  accountId: string;
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
    if (isDriver && !this.isCarPlateValid(carPlate))
      throw new Error("Invalid car plate");
    this.accountId = accountId;
    this.cpf = new CPF(cpf);
    this.email = new Email(email);
    this.name = new Name(name);
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

  getCPf(): string {
    return this.cpf.value;
  }

  private isCarPlateValid(carPlate?: string): boolean {
    return !!carPlate?.match(/[A-Z]{3}[0-9]{4}/);
  }
}
