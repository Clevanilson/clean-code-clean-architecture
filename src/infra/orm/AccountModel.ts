import { Account } from "@/domain/entities/Account";
import { Model, model, column } from "@/infra/orm/Model";

@model("cccat15", "account")
export class AccountModel extends Model {
  @column("account_id") readonly accountId: string;
  @column("name") readonly name: string;
  @column("email") readonly email: string;
  @column("cpf") readonly cpf: string;
  @column("is_passenger") readonly isPassenger: boolean;
  @column("is_driver") readonly isDriver: boolean;
  @column("car_plate") readonly carPlate?: string;

  constructor(
    accountId: string,
    name: string,
    email: string,
    cpf: string,
    isPassenger: boolean,
    isDriver: boolean,
    carPlate?: string
  ) {
    super();
    this.accountId = accountId;
    this.name = name;
    this.email = email;
    this.cpf = cpf;
    this.isDriver = isDriver;
    this.isPassenger = isPassenger;
    this.carPlate = carPlate;
  }

  static fromAggregate(account: Account): AccountModel {
    return new AccountModel(
      account.accountId,
      account.getName(),
      account.getEmail(),
      account.getCPf(),
      account.isPassenger,
      account.isDriver,
      account.getCarPlate()
    );
  }

  getAggregate(): Account {
    return Account.restore(
      this.account_id,
      this.name,
      this.email,
      this.cpf,
      this.isPassenger,
      this.isDriver,
      this.carPlate
    );
  }
}
