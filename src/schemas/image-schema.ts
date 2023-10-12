import { z } from "zod";

export const imageRequestSchema = z.object({
  imageLocationId: z.string(),
  imageCategoryId: z.string(),
  imageName: z.string(),
  imageDescription: z.string(),
});

export type NewImageRequest = z.infer<typeof imageRequestSchema>;
