import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: { type: String },
    title: { type: String },
    alt: { type: String },
    userId: { type: String },
  },
  { timestamps: true }
);

const Image = mongoose.models.image || mongoose.model("image", imageSchema);

export default Image;
