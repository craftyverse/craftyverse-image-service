import express, { Request, Response } from "express";

const router = express.Router();

router.get(
  "/api/image/retrieveImageById:ImageName",
  async (req: Request, res: Response) => {
    const imageNameParam = req.params.ImageName;
    console.log("This is the image name param: ", imageNameParam);
  }
);
