import { z } from "zod";

export const imageRequestSchema = z.object({
  imageLocationId: z.string(),
  imageCategoryId: z.string(),
  imageFileName: z.string(),
  imageDescription: z.string(),
  imageProductId: z.string(),
});

export type NewImageRequest = z.infer<typeof imageRequestSchema>;
