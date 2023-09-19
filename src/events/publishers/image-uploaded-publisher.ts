// import {
//   Publisher,
//   Subjects,
//   ImageUploadedEvent,
// } from "@craftyverse-au/craftyverse-common";
import {
  Publisher,
  Subjects,
  ImageUploadedEvent,
} from "@craftyverse-au/craftyverse-common";

export class ImageUploadedPublisher extends Publisher<ImageUploadedEvent> {
  subject: Subjects.ImageUploaded = Subjects.ImageUploaded;
}
