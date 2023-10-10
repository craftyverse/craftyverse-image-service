import { awsSnsClient } from "@craftyverse-au/craftyverse-common";
import { awsConfig } from "../config/aws-config";
import { imageEventVariables } from "./variables";

export const createImageUploadedTopic = async () => {
  const imageUploadedTopic = imageEventVariables.IMAGE_UPLOADED_EVENT;
  await awsSnsClient.createSnsTopic(awsConfig, imageUploadedTopic);
};
