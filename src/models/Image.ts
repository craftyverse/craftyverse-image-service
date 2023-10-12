import mongoose from "mongoose";

export interface ImageFields {
  imageNameId: string;
  imageName: string;
  imageCategory: string;
  imageDescription: string;
}

export interface ImageModel extends mongoose.Model<ImageDocument> {
  build(fields: ImageFields): ImageDocument;
}

export interface ImageDocument extends mongoose.Document {
  imageNameId: string;
  imageName: string;
  imageCategory: string;
  imageDescription: string;
}

const imageSchema = new mongoose.Schema(
  {
    imageNameId: { type: String, required: true },
    imageName: { type: String, required: true },
    imageCategory: { type: String, required: true },
    imageDescription: { type: String, required: true },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.imageId = ret._id;
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
