import { S3ClientConfig, S3Client } from "@aws-sdk/client-s3";

const awsConfig: S3ClientConfig = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET!,
  },
  region: process.env.AWS_S3_BUCKET_REGION!,
};

export const S3BucketClient = new S3Client(awsConfig);
