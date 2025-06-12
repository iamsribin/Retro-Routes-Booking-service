import { Channel, Connection, connect } from "amqplib";

import {rabbitMq} from "../config/rabbitMq.config";
import Consumer from './consumer';
import Producer from './producer';
import MessageHandler from "./messageHandler";
import BookingController from "../controller/implementaion/booking.controllers";
import BookingService from '../services/implementation/booking_service';
import BookingRepository from "../repositories/implementation/booking_repository";
import { PricingService } from '../services/implementation/pricing_service';

const bookingRepository = new BookingRepository();
const pricingService = new PricingService();
const bookingService  = new BookingService(pricingService,bookingRepository);
const bookingController = new BookingController(bookingService);
const messageHandler = new MessageHandler(bookingController);

class RabbitMQClient {
    private constructor() {}
    private static instance: RabbitMQClient;
    private isInitialized = false;
  
    private producer: Producer | undefined;
    private consumer: Consumer | undefined;
    private connection: Connection | undefined;
    private producerChannel: Channel | undefined;
    private consumerChannel: Channel | undefined;

    public static getInstance() {
        if (!this.instance) {
          this.instance = new RabbitMQClient();
        }
        return this.instance;
    }

    async initialize() {
        if (this.isInitialized) {
          return;
        }
        try {
            this.connection = await connect(rabbitMq.rabbitMQ.url);
      
            const [producerChannel, consumerChannel] = await Promise.all([
              this.connection.createChannel(),
              this.connection.createChannel()
          ]);
          this.producerChannel = producerChannel;
          this.consumerChannel = consumerChannel;
      
const { queue: rpcQueue } = await this.consumerChannel.assertQueue(
  rabbitMq.queues.bookingQueue
  // or { exclusive: false } if you need to specify other options
);
      
            this.producer = new Producer(this.producerChannel);
            this.consumer = new Consumer(this.consumerChannel, rpcQueue,messageHandler);
      
            this.consumer.consumeMessages();
      
            this.isInitialized = true;
          } catch (error) {
            console.log("rabbitmq error...", error);
          }
    }

    async produce(data: any, correlationId: string, replyToQueue: string) {
      try {
        if (!this.isInitialized) {
          await this.initialize();
        }
        return await this.producer?.produceMessages(
          data,
          correlationId,
          replyToQueue
        );
        
      } catch (error) {
        console.log("produce error==",error);
        
      }
      }
}

export default RabbitMQClient.getInstance();