import express from "express";
import { Signup } from "./Signup";
import { GetAccountById } from "./GetAccount";
import { RequestRide } from "./RequestRide";
import { GetRide } from "./GetRide";
import { AccountRepositoryDatabase } from "./AccountRepositoryDatabase";
import { RideRepositoryDatebase } from "./RideRepositoryDatebase";

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
    const rideRepository = new RideRepositoryDatebase();
    const accountRepository = new AccountRepositoryDatabase();
    const requestRide = new RequestRide(rideRepository, accountRepository);
    const output = await requestRide.execute(req.body);
    return res.json(output);
  } catch (error: any) {
    return res.status(422).json({ message: error.message });
  }
});

app.get("/rides/:id", async (req, res) => {
  const rideRepository = new RideRepositoryDatebase();
  const getRide = new GetRide(rideRepository);
  const ride = await getRide.execute(req.params.id);
  return res.json(ride);
});

app.listen(3000, () => {
  console.log("server running");
});
