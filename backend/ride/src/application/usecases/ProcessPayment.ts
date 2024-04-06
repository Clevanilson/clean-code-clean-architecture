export class ProcessPayment {
  async execute(rideId: string): Promise<void> {
    console.log("hello world: ", rideId);
  }
}
