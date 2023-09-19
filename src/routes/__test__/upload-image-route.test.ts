import request from "supertest";
import { app } from "../../app";
import { natsWrapper } from "../../services/nats-wrapper";
import { mockClient } from "aws-sdk-client-mock";
import { S3BucketClient } from "../../config/aws.config";

describe("POST /api/image/uploadImage", () => {
  const S3BucketClientMock = mockClient(S3BucketClient);

  beforeEach(() => {
    S3BucketClientMock.reset();
  });
  it("should return a BadRequest if there is no file to upload", async () => {});
});
