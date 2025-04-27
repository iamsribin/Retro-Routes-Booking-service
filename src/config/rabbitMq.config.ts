export const rabbitMq = {
    rabbitMQ: {
      url: process.env.RABBITMQ_URL || 'amqp://localhost',
    },
    queues: {
      bookingQueue: 'booking_queue',
      driverQueue: 'driver_queue',
    },
  };