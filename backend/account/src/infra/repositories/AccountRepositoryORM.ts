import { Account } from "@/domain/entities/Account";
import { DatabaseConnection } from "@/infra/database/DatabaseConnection";
import { ORM } from "@/infra/orm/ORM";
import { AccountRepository } from "@/infra/repositories/AccountRepository";
import { AccountModel } from "../orm/AccountModel";

export class AccountRepositoryORM implements AccountRepository {
  private readonly orm: ORM;

  constructor(private readonly connection: DatabaseConnection) {
    this.orm = new ORM(this.connection);
  }

  async getByEmail(email: string): Promise<Account | undefined> {
    const result = await this.orm.findBy<FindByReturn>(
      AccountModel,
      "email",
      email
    );
    const account = result?.[0];
    if (!account) return;
    return account.getAggregate();
  }

  async getById(id: string): Promise<Account | undefined> {
    const result = await this.orm.findBy<FindByReturn>(
      AccountModel,
      "account_id",
      id
    );
    const account = result?.[0];
    if (!account) return;
    return account.getAggregate();
  }

  async save(account: Account): Promise<void> {
    return this.orm.save(AccountModel.fromAggregate(account));
  }
}

type FindByReturn = AccountModel[] | undefined;
