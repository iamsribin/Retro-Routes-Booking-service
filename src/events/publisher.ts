import amqp from 'amqplib';

const RABBIT_URL = process.env.RABBIT_URL as string;

class BookingRabbitMQPublisher {
  private static ch: amqp.Channel | null = null;
  private static conn: amqp.Connection | null = null;

  static async initialize(): Promise<void> {
    try {
      this.conn = await amqp.connect(RABBIT_URL);
      this.ch = await this.conn.createChannel();

      // Ensure exchange exists
      await this.ch.assertExchange('retro.routes', 'topic', { durable: true });
      
      console.log('✅ RabbitMQ Publisher initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize RabbitMQ Publisher:', error);
      throw error;
    }
  }

  static async publish(routingKey: string, data: any): Promise<void> {
    if (!this.ch) {
      await this.initialize();
    }

    if (!this.ch) {
      throw new Error('RabbitMQ channel not available');
    }

    try {
      const message = Buffer.from(JSON.stringify(data));
      const published = this.ch.publish('retro.routes', routingKey, message, {
        persistent: true,
        messageId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        headers: {
          source: 'booking-service',
          version: '1.0'
        }
      });

      if (!published) {
        throw new Error('Failed to publish message to RabbitMQ');
      }
      
      console.log(`✅ Published message to ${routingKey}:`, { 
        messageId: message.toString().slice(0, 100) + '...' 
      });
    } catch (error) {
      console.error(`❌ Failed to publish to ${routingKey}:`, error);
      throw error;
    }
  }

  static async close(): Promise<void> {
    try {
      if (this.ch) {
        await this.ch.close();
        this.ch = null;
      }
      if (this.conn) {
        await this.conn.close();
        this.conn = null;
      }
      console.log('✅ RabbitMQ Publisher connection closed');
    } catch (error) {
      console.error('❌ Error closing RabbitMQ Publisher:', error);
    }
  }
}

export { BookingRabbitMQPublisher as RabbitMQPublisher };