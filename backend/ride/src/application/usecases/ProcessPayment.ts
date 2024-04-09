export class ProcessPayment {
  async execute(input: Input): Promise<void> {
    console.log("ProcessPayment", input);
  }
}

type Input = {
  rideId: string;
  creditCardToken: string;
  amount: number;
};
