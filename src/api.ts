import express from "express";
import { AccountDAODatabase, query } from "./AccountDAODatabase";
import { Signup } from "./Signup";
import { GetAccountById } from "./GetAccount";
import { RequestRide } from "./RequestRide";
import { RideDAODatabase } from "./RideDAODatabase";
import { GetRide } from "./GetRide";

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

app.post("/rides/request", async (req, res) => {
  try {
    const rideDAO = new RideDAODatabase();
    const accountDAO = new AccountDAODatabase();
    const requestRide = new RequestRide(rideDAO, accountDAO);
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
