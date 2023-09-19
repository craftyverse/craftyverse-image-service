import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import {
  currentUser,
  errorHandler,
  NotFoundError,
} from "@craftyverse-au/craftyverse-common";
import { uploadImageRouter } from "./routes/upload-image-route";

const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUser);
app.use(uploadImageRouter);

app.all("*", async () => {
  throw new NotFoundError("The route that you have requested does not exist");
});

app.use(errorHandler);

export { app };
