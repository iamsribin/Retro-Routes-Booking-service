import amqp from "amqplib";

class RabbitMQ {
    private _channel: amqp.Channel | null = null;

    constructor() {}

    get channel(): amqp.Channel {
        if (!this._channel)
            throw new Error("cannot access rabbitmq before connection");
        return this._channel;
    }

    // connect to rabbitmq
    async connect(): Promise<void> {
        try {
          const connection = await amqp.connect(process.env.RABBIT_MQ_URL as string);
          this._channel = await connection.createChannel();

            this._channel.on("close", () => {
                console.log("Rabbitmq connection closed, reconnecting...");
                this._channel = null;
                this.connect();
            });

            this._channel.on("error", () => {
                console.log("Rabbitmq connection error, reconnecting...");
                this._channel = null;
                this.connect();
            });
        } catch (err: any) {
            throw new Error(err);
        }
    }
}

export const rabbitmq = new RabbitMQ();