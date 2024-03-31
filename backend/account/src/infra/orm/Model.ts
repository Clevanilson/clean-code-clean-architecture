export class Model {
  declare schema: string;
  declare table: string;
  declare columns: Column[];
  [key: string]: any;
}

export type Column = { property: string; column: string; pk: boolean };

export function model(schema: string, table: string) {
  return (constructor: Function) => {
    constructor.prototype.schema = schema;
    constructor.prototype.table = table;
  };
}

export function column(name: string, pk = false) {
  return (target: any, property: string) => {
    target.columns = target.columns || [];
    target.columns.push({ property, column: name, pk });
  };
}
