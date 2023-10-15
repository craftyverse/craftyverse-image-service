import express, { Request, Response } from "express";
import multer from "multer";
import crypto from "crypto";

import { awsS3Client } from "../services/s3-service";
import { awsConfig } from "../config/aws-config";
import { imageBucketVariables } from "../events/variables";
import { imageRequestSchema } from "../schemas/image-schema";
import { Image } from "../models/Image";

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

    console.log("This is the request body: ", req.body);
    console.log("This is the request image/file", req.file);
    console.log("This is the request file name: ", randomFileName);

    if (!requestedUploadImage) {
      throw new BadRequestError("No image was uploaded");
    }

    if (!imageRequestMetadata.success) {
      throw new RequestValidationError(imageRequestMetadata.error.issues);
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

    const uploadImageMetadata = Image.build({
      imageLocationId: imageRequestMetadataInfo.imageLocationId,
      imageCategoryId: imageRequestMetadataInfo.imageCategoryId,
      imageFileName: imageRequestMetadataInfo.imageFileName,
      imageDescription: imageRequestMetadataInfo.imageDescription,
      imageProductId: imageRequestMetadataInfo.imageProductId,
    });

    const uploadImageMetadataResponse = await uploadImageMetadata.save();

    console.log("image database record: ", uploadImageMetadataResponse);
    console.log("This is the upload image response: ", uploadImageResponse);
    res.send("Hello World!");
  }
);

export { router as uploadImageRouter };
