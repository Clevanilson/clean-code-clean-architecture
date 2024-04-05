import amqp from "amqplib";
import { Queue } from "./Queue";

export class RabbitMQAdapter implements Queue {
  private connection?: amqp.Connection;

  async connect(): Promise<void> {
    this.connection = await amqp.connect("amqp://localhost");
  }

  async publish(queue: string, data: any): Promise<void> {
    if (!this.connection) return;
    const channel = await this.connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
  }

  async consume(queue: string, callback: Function): Promise<void> {
    if (!this.connection) return;
    const channel = await this.connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
    channel.consume(queue, async (message) => {
      if (!message) {
        await callback();
        return;
      }
      await callback(JSON.parse(message.toString()));
      channel.ack(message);
    });
  }
}
