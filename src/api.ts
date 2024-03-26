import express from "express";
import { AccountDAODatabase } from "./AccountDAODatabase";
import { Signup } from "./Signup";
import { GetAccountById } from "./GetAccount";

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const accountDAO = new AccountDAODatabase();
  const signup = new Signup(accountDAO);
  const output = await signup.execute(req.body);
  return res.json(output);
});

app.get("/accounts/:id", async (req, res) => {
  const accountDAO = new AccountDAODatabase();
  const signup = new GetAccountById(accountDAO);
  const output = await signup.execute(req.params.id);
  return res.json(output);
});

app.listen(3000, () => {
  console.log("server running");
});
