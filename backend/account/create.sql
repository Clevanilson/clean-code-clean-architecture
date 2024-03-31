DROP SCHEMA IF EXISTS cccat15 cascade;

CREATE SCHEMA cccat15;

CREATE TABLE cccat15.account (
	account_id uuid PRIMARY KEY,
	name TEXT NOT NULL,
	email TEXT NOT NULL,
	cpf TEXT NOT NULL,
	car_plate TEXT NULL,
	is_passenger BOOLEAN NOT NULL DEFAULT false,
	is_driver BOOLEAN NOT NULL DEFAULT false
);
