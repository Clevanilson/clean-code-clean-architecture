DROP SCHEMA IF EXISTS cccat15 cascade;

CREATE SCHEMA cccat15;

create table cccat15.ride (
	ride_id uuid primary key,
	passenger_id uuid,
	driver_id uuid,
	fare numeric,
	distance numeric,
	status text,
	from_lat numeric,
	from_long numeric,
	to_lat numeric,
	to_long numeric,
	last_lat numeric,
	last_long numeric,
	date timestamp
);

create table cccat15.position (
	position_id uuid primary key,
	ride_id uuid,
	lat numeric,
	long numeric,
	date timestamp
);

create table cccat15.transaction (
	transaction_id uuid primary key,
	ride_id uuid,
	amount numeric,
	date timestamp,
	status text
);

create table cccat15.ride_projection (
	ride_id uuid,
	passenger_id uuid,
	driver_id uuid,
	fare numeric,
	distance numeric,
	status text,
	passenger_name text null,
	passenger_cpf text null,
	driver_name text null,
	driver_cpf text null,
	driver_car_plate text null
);