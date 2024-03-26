import express from "express";
import { AccountDAODatabase, query } from "./AccountDAODatabase";
import { Signup } from "./Signup";
import { GetAccountById } from "./GetAccount";
import crypto from "crypto";

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
  const rideId = crypto.randomUUID();
  const { passengerId } = req.body;
  const account = await query(
    `SELECT is_passenger FROM cccat15.account WHERE account_id = $1`,
    [passengerId]
  );
  if (!account?.rows[0]?.is_passenger) {
    return res.status(422).json({
      message: "User must be a passenger"
    });
  }
  await query(
    `
    INSERT INTO
    cccat15.ride 
    (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) 
    VALUES 
    ($1, $2, $3, $4, $5, $6, $7, $8);`,
    [
      rideId,
      req.body.passengerId,
      req.body.fromLat,
      req.body.fromLong,
      req.body.toLat,
      req.body.toLong,
      "requested",
      new Date()
    ]
  );
  return res.json({ rideId });
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
