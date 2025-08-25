import amqp from "amqplib";

const RABBIT_URL = process.env.RABBIT_URL as string;

export async function createRabbit() {
  const conn = await amqp.connect(RABBIT_URL);
  const ch = await conn.createChannel();

  await ch.assertExchange("retro.routes", "topic", { durable: true });

  // queue for driver acceptance
  await ch.assertQueue("booking.driverAcceptance", { durable: true });
  await ch.bindQueue("booking.driverAcceptance", "retro.routes", "driver.acceptance");

  return { conn, ch };
}
