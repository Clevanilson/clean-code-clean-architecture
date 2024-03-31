import { DatabaseConnection } from "../database/DatabaseConnection";
import { Column, Model } from "./Model";

export class ORM {
  constructor(private readonly connection: DatabaseConnection) {}

  async save(model: Model): Promise<void> {
    const columns = model.columns.map(({ column }) => column).join(",");
    const params = model.columns.map((_, index) => `$${index + 1}`).join(",");
    const values = model.columns.map(({ property }) => model[property]);
    const query = `
      INSERT INTO ${model.schema}.${model.table} (${columns})
      VALUES (${params});   
    `;
    await this.connection.query(query, values);
  }

  async findBy<T>(Model: any, field: string, value: unknown): Promise<T> {
    const query = `SELECT * FROM ${Model.prototype.schema}.${Model.prototype.table} WHERE ${field} = $1`;
    const results = await this.connection.query(query, [value]);
    return results?.map((result: any) => {
      const model = new Model();
      Model.prototype.columns.forEach((column: Column) => {
        model[column.property] = result[column.column];
      });
      return model;
    });
  }
}
