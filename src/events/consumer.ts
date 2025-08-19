import { createRabbit } from "../config/rabbitmq";
import { BookingController } from "../controller/implementation/booking-controllers";

export class BookingConsumer {
  private ch: any;

  constructor(private _bookingController: BookingController) {}

  async start() {
    const { conn, ch } = await createRabbit();
    this.ch = ch;

    console.log("🚀 Booking service started with RabbitMQ consumers");

    // Driver acceptance
    await ch.consume("booking.driverAcceptance", async (msg: any) => {
      if (!msg) return;
      try {
        const payload = JSON.parse(msg.content.toString());
        console.log("📩 booking.driverAcceptance payload:", payload);

        // await this._bookingController.handleDriverAcceptance(payload);

        ch.ack(msg);
      } catch (err) {
        console.error("❌ DriverAcceptance handler error:", err);
        ch.nack(msg, false, false); // dead-letter
      }
    });
  }

  async stop() {
    try {
      if (this.ch) {
        await this.ch.close();
        console.log("✅ RabbitMQ channel closed");
      }
    } catch (error) {
      console.error("❌ Error stopping booking consumer:", error);
    }
  }
}
