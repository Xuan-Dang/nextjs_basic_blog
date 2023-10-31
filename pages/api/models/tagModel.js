import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

const Tag = mongoose.models.tag || mongoose.model("tag", tagSchema);

export default Tag;
