import { CPF } from "@/domain/valueObjects/CPF";

test.each(["97456321558", "71428793860", "87748248800"])(
  "Shoud test a valid CPF: %s",
  (cpf) => {
    expect(new CPF(cpf).value).toEqual(cpf);
  }
);

test.each(["11111111111", "7142879386", "87748248801", ""])(
  "Should test an invalid CPF: %s",
  (cpf) => {
    expect(() => new CPF(cpf)).toThrow("Invalid CPF");
  }
);
