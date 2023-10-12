import {
  Bucket,
  CreateBucketCommand,
  ListBucketsCommand,
  ListBucketsCommandOutput,
  S3Client,
  S3ClientConfig,
} from "@aws-sdk/client-s3";

export const awsS3Client = (() => {
  let s3Client: S3Client;

  const createS3Client = (config: S3ClientConfig): S3Client => {
    if (!s3Client) {
      s3Client = new S3Client(config);
    }

    return s3Client;
  };

  const listS3Buckets = async (
    config: S3ClientConfig
  ): Promise<ListBucketsCommandOutput | undefined> => {
    const s3Client = createS3Client(config);
    const input = undefined;

    const listS3BucketsCommand = new ListBucketsCommand({});
    console.log("This is the listS3BucketsCommand: ", listS3BucketsCommand);
    const s3Buckets = await s3Client.send(listS3BucketsCommand);
    console.log("This are the list of buckets: ", s3Buckets);

    return s3Buckets;
  };

  const createS3Bucket = async (
    config: S3ClientConfig,
    bucketName: string
  ): Promise<string | undefined | Bucket[]> => {
    const s3Client = createS3Client(config);
    const createS3BucketCommand = new CreateBucketCommand({
      Bucket: bucketName,
    });

    const existingS3Buckets = await listS3Buckets(config);
    console.log("This are the existing buckets: ", existingS3Buckets);

    if (existingS3Buckets) {
      return existingS3Buckets.Buckets;
    }

    const createS3BucketResponse = await s3Client.send(createS3BucketCommand);
    console.log("This is the response: ", createS3BucketResponse);
    return createS3BucketResponse.Location;
  };

  const putitem = async () => {};

  return {
    createS3Bucket,
    createS3Client,
  };
})();
