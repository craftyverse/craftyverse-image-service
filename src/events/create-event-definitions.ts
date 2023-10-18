import { awsSnsClient } from "@craftyverse-au/craftyverse-common";
import { awsConfig } from "../config/aws-config";
import { imageEventVariables } from "./variables";

export const createImageUploadedTopic = async (): Promise<string> => {
  const imageUploadedTopic = imageEventVariables.IMAGE_UPLOADED_EVENT;
  const topicArn = await awsSnsClient.createSnsTopic(
    awsConfig,
    imageUploadedTopic
  );
  return topicArn.topicArn;
};

export const createBatchImageUploadedTopic = async (): Promise<string> => {
  const batchImageUploadedTopic =
    imageEventVariables.IMAGE_BATCH_UPLOADED_EVENT;
  const topicArn = await awsSnsClient.createSnsTopic(
    awsConfig,
    batchImageUploadedTopic
  );
  return topicArn.topicArn;
};
