import { validateCpf } from "../src/domain/validateCpf";

test.each(["97456321558", "71428793860", "87748248800"])(
  "Shoud test a valid CPF: %s",
  (cpf) => {
    const isValid = validateCpf(cpf);
    expect(isValid).toEqual(true);
  }
);

test.each(["11111111111", "7142879386", "87748248801", ""])(
  "Should test an invalid CPF: %s",
  (cpf) => {
    const isValid = validateCpf(cpf);
    expect(isValid).toEqual(false);
  }
);
