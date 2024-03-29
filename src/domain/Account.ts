import crypto from "crypto";
import { Name } from "@/domain//Name";
import { Email } from "@/domain/Email";
import { CPF } from "@/domain/CPF";
import { CarPlate } from "./CarPlate";

export class Account {
  private cpf: CPF;
  private email: Email;
  private name: Name;
  private carPlate?: CarPlate;
  accountId: string;
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
    if (isDriver) this.carPlate = new CarPlate(carPlate ?? "");
    this.cpf = new CPF(cpf);
    this.email = new Email(email);
    this.name = new Name(name);
    this.isDriver = isDriver;
    this.accountId = accountId;
    this.isPassenger = isPassenger;
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

  getCarPlate(): string | undefined {
    return this.carPlate?.value;
  }
}
