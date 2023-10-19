import request from "supertest";
import { app } from "../../app";
import path from "path";
import { awsSnsClient, awsSqsClient } from "@craftyverse-au/craftyverse-common";
import { imageQueueVariables } from "../../events/event-variables";

describe("POST /api/image/uploadImage", () => {
  const mockAwsConfig = {
    credentials: {
      accessKeyId: "aws_access_key_id",
      secretAccessKey: "aws_secret_access_key",
    },
    region: "us-east-1",
    endpoint: "http://localhost:4666",
  };
  describe("## Request Validation", () => {
    const uploadImageMetadataPayload = {
      imageLocationId: "imageLoc1",
      imageCategoryId: "imageCat1",
      imageFileName: "1cf7064e3836",
      imageFileOriginalName: "image.jpg",
      imageDescription: "image description",
      imageProductId: "image product Id",
    };
    it("should return a 400 response (BadRequestError) if there are no file included in the request", async () => {
      const response = await request(app)
        .post("/api/image/uploadImage")
        .set("Cookie", global.signup())
        .expect(400);

      console.log(response.body);
      expect(response.body.errors[0].message).toEqual("No image was uploaded");
      expect(response.body.errors[0].field).toEqual("badRequest");
    });

    it("should return a 400 (BadRequestError) if the request payload does not exist", async () => {
      const response = await request(app)
        .post("/api/image/uploadImage")
        .set("Cookie", global.signup())
        .attach("image", path.resolve(__dirname, "image.jpg"))
        .expect(400);

      console.log(response.body);
    });

    it('should return a RequestValidationError (400) if the request payload does not contain "imageLocationId"', async () => {
      const uploadImageMetadataPayload = {
        imageCategoryId: "imageCat1",
        imageFileName: "1cf7064e3836",
        imageFileOriginalName: "image.jpg",
        imageDescription: "image description",
        imageProductId: "image product Id",
      };

      const response = await request(app)
        .post("/api/image/uploadImage")
        .set("Cookie", global.signup())
        .attach("image", path.resolve(__dirname, "image.jpg"))
        .field(uploadImageMetadataPayload)
        .expect(400);

      console.log(response.body);
      expect(response.body.errors[0].message).toEqual("Required");
      expect(response.body.errors[0].field).toEqual("imageLocationId");
    });

    it('should return a RequestValidationError (400) if the request payload does not contain "imageCategoryId"', async () => {
      const uploadImageMetadataPayload = {
        imageLocationId: "imageLoc1",
        imageFileName: "1cf7064e3836",
        imageFileOriginalName: "image.jpg",
        imageDescription: "image description",
        imageProductId: "image product Id",
      };

      const response = await request(app)
        .post("/api/image/uploadImage")
        .set("Cookie", global.signup())
        .attach("image", path.resolve(__dirname, "image.jpg"))
        .field(uploadImageMetadataPayload)
        .expect(400);

      expect(response.body.errors[0].message).toEqual("Required");
      expect(response.body.errors[0].field).toEqual("imageCategoryId");
    });

    it('should return a RequestValidationError (400) if the request payload does not contain "imageDescription"', async () => {
      const uploadImageMetadataPayload = {
        imageLocationId: "imageLoc1",
        imageCategoryId: "imageCat1",
        imageFileName: "1cf7064e3836",
        imageFileOriginalName: "image.jpg",
        imageProductId: "image product Id",
      };

      const response = await request(app)
        .post("/api/image/uploadImage")
        .set("Cookie", global.signup())
        .attach("image", path.resolve(__dirname, "image.jpg"))
        .field(uploadImageMetadataPayload)
        .expect(400);

      expect(response.body.errors[0].message).toEqual("Required");
      expect(response.body.errors[0].field).toEqual("imageDescription");
    });

    it('should return a RequestValidationError (400) if the request payload does not contain "imageProductId"', async () => {
      const uploadImageMetadataPayload = {
        imageLocationId: "imageLoc1",
        imageCategoryId: "imageCat1",
        imageFileName: "1cf7064e3836",
        imageFileOriginalName: "image.jpg",
        imageDescription: "image description",
      };

      const response = await request(app)
        .post("/api/image/uploadImage")
        .set("Cookie", global.signup())
        .attach("image", path.resolve(__dirname, "image.jpg"))
        .field(uploadImageMetadataPayload)
        .expect(400);

      expect(response.body.errors[0].message).toEqual("Required");
      expect(response.body.errors[0].field).toEqual("imageProductId");
    });
  });

  describe("## Image Upload validation", () => {
    it("it should return a 201 response (Created Ok) if the image upload fails", async () => {
      const uploadImageMetadataPayload = {
        imageLocationId: "imageLoc1",
        imageCategoryId: "imageCat1",
        imageDescription: "image description",
        imageProductId: "image product Id",
      };

      const response = await request(app)
        .post("/api/image/uploadImage")
        .set("Cookie", global.signup())
        .attach("image", path.resolve(__dirname, "image.jpg"))
        .field(uploadImageMetadataPayload)
        .expect(201);

      console.log(response.body);
      expect(response.body).toEqual({
        imageId: response.body.imageId,
        imageLocationId: "imageLoc1",
        imageCategoryId: "imageCat1",
        imageFileName: response.body.imageFileName,
        imageFileOriginalName: "image.jpg",
        imageDescription: "image description",
        imageProductId: "image product Id",
      });
    });
  });

  describe("## Event messaging validation", () => {
    it("Should successfully create a 'image_upload_queue' SQS queue", async () => {
      const uploadImageMetadataPayload = {
        imageLocationId: "imageLoc1",
        imageCategoryId: "imageCat1",
        imageDescription: "image description",
        imageProductId: "image product Id",
      };

      await request(app)
        .post("/api/image/uploadImage")
        .set("Cookie", global.signup())
        .attach("image", path.resolve(__dirname, "image.jpg"))
        .field(uploadImageMetadataPayload)
        .expect(201);

      const queueList = await awsSqsClient.listAllSqsQueues(mockAwsConfig, {
        queueNamePrefix: imageQueueVariables.IMAGE_UPLOADED_QUEUE,
        maxResults: 1,
      });

      console.log(queueList);
      expect(queueList.QueueUrls).toEqual([
        "http://localhost:4666/000000000000/image_upload_queue",
      ]);
    });

    it('should successfully create a SNS "image_uploaded" topic', async () => {
      const uploadImageMetadataPayload = {
        imageLocationId: "imageLoc1",
        imageCategoryId: "imageCat1",
        imageDescription: "image description",
        imageProductId: "image product Id",
      };

      await request(app)
        .post("/api/image/uploadImage")
        .set("Cookie", global.signup())
        .attach("image", path.resolve(__dirname, "image.jpg"))
        .field(uploadImageMetadataPayload)
        .expect(201);

      const topicArn = await awsSnsClient.getFullTopicArnByTopicName(
        mockAwsConfig,
        "image_uploaded"
      );

      console.log(topicArn);
      expect(topicArn).toEqual(
        "arn:aws:sns:us-east-1:000000000000:image_uploaded"
      );
    });

    it("should successfully publish a SNS message to the queue when a image is uploaded", async () => {
      const publishSnsMessageSpy = jest.spyOn(
        awsSnsClient,
        "publishSnsMessage"
      );
      const uploadImageMetadataPayload = {
        imageLocationId: "imageLoc1",
        imageCategoryId: "imageCat1",
        imageDescription: "image description",
        imageProductId: "image product Id",
      };

      const response = await request(app)
        .post("/api/image/uploadImage")
        .set("Cookie", global.signup())
        .attach("image", path.resolve(__dirname, "image.jpg"))
        .field(uploadImageMetadataPayload)
        .expect(201);

      expect(response.status).toEqual(201);
      expect(publishSnsMessageSpy).toHaveBeenCalledTimes(1);
    });

    it('should return an error if the SNS "image_uploaded" topic does not exist', async () => {
      const snsTopicSpy = jest
        .spyOn(awsSnsClient, "getFullTopicArnByTopicName")
        .mockResolvedValueOnce(undefined);

      const uploadImageMetadataPayload = {
        imageLocationId: "imageLoc1",
        imageCategoryId: "imageCat1",
        imageDescription: "image description",
        imageProductId: "image product Id",
      };

      const response = await request(app)
        .post("/api/image/uploadImage")
        .set("Cookie", global.signup())
        .attach("image", path.resolve(__dirname, "image.jpg"))
        .field(uploadImageMetadataPayload)
        .expect(400);

      expect(response.body.errors[0].message).toEqual("Something went wrong!");
      expect(response.body.errors[0].field).toEqual("badRequest");
    });
  });
});
