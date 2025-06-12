export const rabbitMq = {
    rabbitMQ: {
      url: process.env.RABBITMQ_URL || 'amqp://localhost',
    },
    queues: {
      bookingQueue: 'ride_booking_queue9',
    },
  };