import amqp from "amqplib";

async function main() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue("test", { durable: true });
  const input = { id: "test" };
  channel.sendToQueue("test", Buffer.from(JSON.stringify(input)));
}

main();
