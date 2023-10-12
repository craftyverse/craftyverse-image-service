// This file will instantiate all of the different AWS resources it needs for the service
import { SNSClientConfig } from "@aws-sdk/client-sns";

export const awsConfig: SNSClientConfig = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET!,
  },
  region: process.env.AWS_REGION!,
  endpoint: process.env.AWS_LOCALSTACK_URI!,
};
