export class RideStartedEvent {
  static eventName = "RideStarted";

  constructor(readonly rideId: string) {}
}
