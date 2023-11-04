import mongoose from "mongoose";

const imageShema = new mongoose.Schema(
  {
    title: { type: String },
    alt: { type: String },
    url: { type: String, required: true },
    user: { type: String, ref: "user", required: true },
  },
  { timestamps: true }
);

const Image = mongoose.models.image || mongoose.model("image", imageShema);

export default Image;
