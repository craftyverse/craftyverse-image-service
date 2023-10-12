import mongoose from "mongoose";
import { app } from "./app";
import { awsSnsClient, awsSqsClient } from "@craftyverse-au/craftyverse-common";
import { createImageUploadedTopic } from "./events/create-event-definitions";
import { awsConfig } from "./config/aws-config";
import { imageQueueVariables } from "./events/variables";
import { SQSClientConfig } from "@aws-sdk/client-sqs";
import { awsS3Client } from "./services/s3-service";
import { S3ClientConfig } from "@aws-sdk/client-s3";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY is not supplied.");
  }

  if (!process.env.IMAGE_DATABASE_MONGODB_URI) {
    throw new Error("LOCATION_DATABASE_MONGODB_URI is not supplied");
  }

  if (
    !process.env.AWS_ACCESS_KEY ||
    !process.env.AWS_SECRET ||
    !process.env.AWS_REGION
  ) {
    throw new Error("AWS credentials are not supplied");
  }

  // Create SNS location created Topic and SQS location created Queue
  const topicArn = await createImageUploadedTopic();
  console.log("This is the topic ARN: ", topicArn);

  const sqsQueueAttributes = {
    delaySeconds: "0",
    messageRetentionPeriod: "604800", // 7 days
    receiveMessageWaitTimeSeconds: "0",
  };

  const createLocationQueue = await awsSqsClient.createSqsQueue(
    awsConfig as SQSClientConfig,
    imageQueueVariables.IMAGE_UPLOADED_QUEUE,
    sqsQueueAttributes
  );

  console.log("This is the new queue: ", createLocationQueue);

  // Initialing the S3 bucket
  const imageBucket = await awsS3Client.createS3Bucket(
    awsConfig as S3ClientConfig,
    "craftyverse-image-bucket"
  );

  console.log("This is the new bucket", imageBucket);

  try {
    console.log("connecting to mongodb...");
    await mongoose.connect(process.env.IMAGE_DATABASE_MONGODB_URI as string);
    console.log("connected to mongodb :)");
  } catch (error) {
    console.log("There is an error in connecting to mongoDb");
    console.error(error);
  }

  app.listen(5000, () => {
    console.log("Connected to AWS ecosystem...");
    console.log("listening on port 4000");
  });
};

start();
