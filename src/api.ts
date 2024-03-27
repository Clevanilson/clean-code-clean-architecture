import express from "express";
import { AccountDAODatabase, query } from "./AccountDAODatabase";
import { Signup } from "./Signup";
import { GetAccountById } from "./GetAccount";
import { RequestRide } from "./RequestRide";
import { RideDAODatabase } from "./RideDAODatabase";

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
    console.log(error.message);
    return res.status(422).json({ message: error.message });
  }
});

app.get("/rides/:id", async (req, res) => {
  const rides = await query("SELECT * FROM cccat15.ride WHERE ride_id = $1", [
    req.params.id
  ]);
  return res.json(rides?.rows[0]);
});

app.listen(3000, () => {
  console.log("server running");
});
