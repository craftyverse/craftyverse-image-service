import { z } from "zod";

export const imageRequestSchema = z.object({
  imageLocationId: z.string(),
  imageCategoryId: z.string(),
  imageDescription: z.string(),
  imageProductName: z.string(),
});

export const imageResponseSchema = z.object({
  imageId: z.string(),
  imageLocationId: z.string(),
  imageCategoryId: z.string(),
  imageFileName: z.string(),
  imageFileOriginalName: z.string(),
  imageDescription: z.string(),
  imageProductName: z.string(),
});

export type NewImageRequest = z.infer<typeof imageRequestSchema>;
export type NewImageResponse = z.infer<typeof imageResponseSchema>;
