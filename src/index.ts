import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./services/nats-wrapper";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY is not supplied.");
  }

  try {
    natsWrapper.connect(
      process.env.NATS_CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URL!
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    console.log("connecting to mongodb...");
    await mongoose.connect(process.env.LOCATION_DATABASE_MONGODB_URI as string);
    console.log("connected to mongodb :)");
  } catch (error) {
    console.log("There is an error in connecting to mongoDb");
    console.error(error);
  }

  app.listen(4000, () => {
    console.log("listening on port 4000");
  });
};

start();
