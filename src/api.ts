import express from "express";
import { Signup } from "./Signup";
import { GetAccountById } from "./GetAccount";
import { RequestRide } from "./RequestRide";
import { RideDAODatabase } from "./RideDAODatabase";
import { GetRide } from "./GetRide";
import { AccountRepositoryDatabase } from "./AccountRepositoryDatabase";

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const accountRepository = new AccountRepositoryDatabase();
  const signup = new Signup(accountRepository);
  const output = await signup.execute(req.body);
  return res.json(output);
});

app.get("/accounts/:id", async (req, res) => {
  const accountRepository = new AccountRepositoryDatabase();
  const signup = new GetAccountById(accountRepository);
  const output = await signup.execute(req.params.id);
  return res.json(output);
});

app.post("/rides/request", async (req, res) => {
  try {
    const rideDAO = new RideDAODatabase();
    const accountRepository = new AccountRepositoryDatabase();
    const requestRide = new RequestRide(rideDAO, accountRepository);
    const output = await requestRide.execute(req.body);
    return res.json(output);
  } catch (error: any) {
    return res.status(422).json({ message: error.message });
  }
});

app.get("/rides/:id", async (req, res) => {
  const rideDAO = new RideDAODatabase();
  const getRide = new GetRide(rideDAO);
  const ride = await getRide.execute(req.params.id);
  return res.json(ride);
});

app.listen(3000, () => {
  console.log("server running");
});
