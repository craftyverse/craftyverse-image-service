// This file will instantiate all of the different AWS resources it needs for the service

import { S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
import { SNSClientConfig } from "@aws-sdk/client-sns";

export const awsConfig: SNSClientConfig = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET!,
  },
  region: process.env.AWS_REGION!,
  endpoint: process.env.AWS_LOCALSTACK_URI!,
};

export const S3BucketClient = new S3Client(awsConfig as S3ClientConfig);
