import { awsSnsClient } from "@craftyverse-au/craftyverse-common";
import { awsConfig } from "../config/aws-config";
import { imageEventVariables } from "@craftyverse-au/craftyverse-common";

export const createImageUploadedTopic = async (): Promise<string> => {
  const imageUploadedTopic = imageEventVariables.IMAGE_UPLOADED_EVENT;
  const topicArn = await awsSnsClient.createSnsTopic(
    awsConfig,
    imageUploadedTopic
  );
  return topicArn.topicArn;
};
