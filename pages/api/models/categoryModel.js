import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String },
    image: { type: String, ref: "image" },
  },
  { timestamps: true }
);

const Category =
  mongoose.models.category || mongoose.model("category", categorySchema);

export default Category;
