import { Channel, Connection, connect } from "amqplib";
import { io } from 'socket.io-client';


import {rabbitMq} from "../config/rabbitMq.config";
import Consumer from './consumer'
import Producer from './producer'
import MessageHandler from "./messageHandler";
import BookingController from "../controller/booking.controllers";
import BookingService from '../services/booking_service';
import BookingRepository from "../repositories/booking.repository";
import { PricingService } from '../services/pricing_service';

const socket = io('http://localhost:3000');
const bookingRepository = new BookingRepository()
const pricingService = new PricingService()
const bookingService  = new BookingService(pricingService,bookingRepository)
const bookingController = new BookingController(bookingService,socket)
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
              rabbitMq.queues.bookingQueue,
              { exclusive: true }
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
        console.log(error);
        
      }
      }
  
}

export default RabbitMQClient.getInstance();