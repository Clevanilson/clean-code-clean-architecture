export class RideCompletedEvent {
  constructor(
    readonly rideId: string,
    readonly creditCardToken: string,
    readonly ammout: number
  ) {}
}
