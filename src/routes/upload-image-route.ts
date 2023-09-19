import express, { Request, Response } from "express";
import multer from "multer";
import crypto from "crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { BadRequestError } from "@craftyverse-au/craftyverse-common";
import { S3BucketClient } from "../config/aws.config";
import { ImageUploadedPublisher } from "../events/publishers/image-uploaded-publisher";
import { natsWrapper } from "../services/nats-wrapper";

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
    if (!req.file) {
      throw new BadRequestError("There is no file uploaded in the request!");
      new ImageUploadedPublisher(natsWrapper.client).publish({});
    }

    const imageName: string = randomImageName();

    const params = {
      Bucket: awsS3BucketName,
      Key: imageName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const uploadImageCommand = new PutObjectCommand(params);
    await S3BucketClient.send(uploadImageCommand);

    new ImageUploadedPublisher(natsWrapper.client).publish({
      imageName: imageName,
      contentType: req.file.mimetype,
    });

    res.status(201).send("success!");
  }
);

export { router as uploadImageRouter };
