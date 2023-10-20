import express, { Request, Response } from "express";
import multer from "multer";
import crypto from "crypto";

import { awsS3Client } from "../services/s3-service";
import { awsConfig } from "../config/aws-config";
import {
  imageBucketVariables,
  imageEventVariables,
} from "@craftyverse-au/craftyverse-common";
import { imageRequestSchema, NewImageResponse } from "../schemas/image-schema";
import { Image } from "../models/Image";
import { awsSnsClient } from "@craftyverse-au/craftyverse-common";
import redisClient from "../services/redis-service";

import {
  BadRequestError,
  RequestValidationError,
} from "@craftyverse-au/craftyverse-common";

const router = express.Router();

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Creating a random image name
const randomImageName = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString("hex");
};

router.post(
  "/api/image/uploadImage",
  upload.single("image"),
  async (req: Request, res: Response) => {
    const randomFileName = randomImageName();
    const requestedUploadImage = req.file;
    const imageRequestMetadata = imageRequestSchema.safeParse(req.body);
    const topicArn = await awsSnsClient.getFullTopicArnByTopicName(
      awsConfig,
      imageEventVariables.IMAGE_UPLOADED_EVENT
    );

    console.log("This is the request body: ", req.body);
    console.log("This is the request image/file", req.file);
    console.log("This is the request file name: ", randomFileName);

    if (!requestedUploadImage) {
      throw new BadRequestError("No image was uploaded");
    }

    if (!imageRequestMetadata.success) {
      throw new RequestValidationError(imageRequestMetadata.error.issues);
    }

    if (!topicArn) {
      throw new BadRequestError("Something went wrong!");
    }

    const imageRequestMetadataInfo = imageRequestMetadata.data;

    console.log(
      "This is the image request metadata: ",
      imageRequestMetadataInfo
    );

    const uploadImageResponse = await awsS3Client.uploadFile(
      awsConfig,
      requestedUploadImage,
      {
        bucketName: imageBucketVariables.IMAGE_BUCKET_NAME,
        key: randomFileName,
        contentType: requestedUploadImage.mimetype,
      }
    );

    if (!uploadImageResponse) {
      throw new BadRequestError("Image has not been uploaded");
    }

    const uploadImageMetadata = Image.build({
      imageLocationId: imageRequestMetadataInfo.imageLocationId,
      imageCategoryId: imageRequestMetadataInfo.imageCategoryId,
      imageFileName: randomFileName,
      imageFileOriginalName: requestedUploadImage.originalname,
      imageDescription: imageRequestMetadataInfo.imageDescription,
      imageProductName: imageRequestMetadataInfo.imageProductName,
    });

    const uploadImageMetadataResponse = await uploadImageMetadata.save();

    const imageMetadataResposne: NewImageResponse = {
      imageId: uploadImageMetadataResponse._id,
      imageLocationId: uploadImageMetadataResponse.imageLocationId,
      imageCategoryId: uploadImageMetadataResponse.imageCategoryId,
      imageFileName: uploadImageMetadataResponse.imageFileName,
      imageFileOriginalName: uploadImageMetadataResponse.imageFileOriginalName,
      imageDescription: uploadImageMetadataResponse.imageDescription,
      imageProductName: uploadImageMetadataResponse.imageProductName,
    };

    redisClient.set(imageMetadataResposne.imageId, imageMetadataResposne);

    const imageMetadataResponseString = JSON.stringify(imageMetadataResposne);

    const publishSnsMessageParams = {
      message: imageMetadataResponseString,
      subject: "create_image_event",
      topicArn,
    };

    const uploadImageMessage = await awsSnsClient.publishSnsMessage(
      awsConfig,
      publishSnsMessageParams
    );

    console.log("This is the uploadImageMessage: ", uploadImageMessage);

    if (!uploadImageMessage) {
      throw new BadRequestError("Something went wrong!");
    }

    console.log("image database record: ", uploadImageMetadataResponse);
    console.log("This is the upload image response: ", uploadImageResponse);
    res.status(201).send({ ...imageMetadataResposne });
  }
);

export { router as uploadImageRouter };
