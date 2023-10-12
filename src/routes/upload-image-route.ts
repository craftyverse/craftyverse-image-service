import express, { Request, Response } from "express";
import multer from "multer";
import crypto from "crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Image } from "../models/Image";
import {
  BadRequestError,
  RequestValidationError,
} from "@craftyverse-au/craftyverse-common";
import { NewImageRequest, imageRequestSchema } from "../schemas/image-schema";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const awsS3BucketName = process.env.AWS_S3_BUCKET_NAME;

const randomImageName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

router.post(
  "/api/image/uploadImage",
  upload.single("image"),
  async (req: Request, res: Response) => {
    // if (!req.file) {
    //   throw new BadRequestError("There is no file uploaded in the request!");
    // }

    // const imageName: string = randomImageName();

    // const uploadImageParams = {
    //   Bucket: awsS3BucketName,
    //   Key: imageName,
    //   Body: req.file.buffer,
    //   ContentType: req.file.mimetype,
    // };

    // const uploadImageCommand = new PutObjectCommand(uploadImageParams);
    // await S3BucketClient.send(uploadImageCommand);

    res.status(201).send("Image successfully uploaded!");
  }
);

export { router as uploadImageRouter };
