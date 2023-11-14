import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String },
    content: { type: String },
    isPublish: { type: Boolean, default: false },
    image: { type: String, ref: "image" },
    author: { type: String, ref: "user" },
    category: {type: String, ref: "category"},
  },
  { timestamps: true }
);

const Post = mongoose.models.post || mongoose.model("post", postSchema);

export default Post;
