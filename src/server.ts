// import App from "./app";

// new App()


import path from "path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import "dotenv/config";

import connectDB from "./config/mongo";
connectDB();

import { BookingController } from "./controller/implementation/booking-controllers";
import { VehicleController } from "./controller/implementation/vehicle-controller";
import { BookingService } from "./services/implementation/booking-service";
import { VehicleService } from "./services/implementation/vehicle-service";
import { BookingRepository } from "./repositories/implementation/booking-repository";
import { PricingRepository } from "./repositories/implementation/pricing-repository";
import { BookingConsumer } from "./events/consumer";

const bookingRepository = new BookingRepository();
const pricingRepository = new PricingRepository();

const vehicleService = new VehicleService(pricingRepository)
const bookingService = new BookingService(bookingRepository);

const bookingController = new BookingController(bookingService);
const vehicleController = new VehicleController(vehicleService);

const consumer = new BookingConsumer(bookingController)
consumer.start().catch(err => {
  console.error('Failed to start realtime service', err);
  process.exit(1);
});

// === Load gRPC Proto ===
const PROTO_PATH = path.resolve(__dirname, "./proto/ride.proto");

const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const grpcObject = grpc.loadPackageDefinition(packageDef) as any;
const rideProto = grpcObject.ride_package;

// === Validate Proto Service ===
if (!rideProto?.Ride?.service) {
  console.error("❌ Failed to load the User service from the proto file.");
  process.exit(1);
}
 
const server = new grpc.Server();
 
server.addService(rideProto.Ride.service, {
fetchVehicles:vehicleController.fetchVehicles.bind(vehicleController),
bookCab:bookingController.createBooking.bind(bookingController)
// fetchDriverBookingList:bookingController.fetchDriverBookingList.bind(bookingController),
// fetchDriverBookingDetails:bookingController.fetchDriverBookingDetails.bind(bookingController),
// cancelRide:bookingController.cancelRide.bind(bookingController),
})

// === Start gRPC Server ===  
const startGrpcServer = () => {
  const port = process.env.PORT || "3002";
  const domain =
    process.env.NODE_ENV === "dev"
      ? process.env.DEV_DOMAIN
      : process.env.PRO_DOMAIN_USER;

  const address = `${domain}:${port}`;
  console.log(`🌐 Binding gRPC server to: ${address}`);

  server.bindAsync(
    address,
    grpc.ServerCredentials.createInsecure(),
    (err, bindPort) => {
      if (err) {
        console.error("❌ Error starting gRPC server:", err);
        return;
      }
      console.log(`✅ gRPC user service started on port: ${bindPort}`);
    }
  );
};

startGrpcServer();