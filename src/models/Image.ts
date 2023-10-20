import mongoose from "mongoose";

export interface ImageFields {
  imageLocationId: string;
  imageCategoryId: string;
  imageFileName: string;
  imageFileOriginalName: string;
  imageDescription: string;
  imageProductName: string;
}

export interface ImageModel extends mongoose.Model<ImageDocument> {
  build(fields: ImageFields): ImageDocument;
}

export interface ImageDocument extends mongoose.Document {
  imageLocationId: string;
  imageCategoryId: string;
  imageFileName: string;
  imageFileOriginalName: string;
  imageDescription: string;
  imageProductName: string;
}

const imageSchema = new mongoose.Schema(
  {
    imageLocationId: { type: String, required: true },
    imageCategoryId: { type: String, required: true },
    imageFileName: { type: String, required: true },
    imageFileOriginalName: { type: String, required: true },
    imageDescription: { type: String, required: true },
    imageProductName: { type: String, required: true },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

imageSchema.statics.build = (fields: ImageFields) => {
  return new Image(fields);
};

const Image = mongoose.model<ImageDocument, ImageModel>("Image", imageSchema);

export { Image };
