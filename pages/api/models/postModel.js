import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String },
    content: { type: String },
    publishedAt: { type: Date, default: Date.now() },
    isPublish: { type: Boolean, default: false },
    image: { type: String, default: "/images/default-image.png" },
    author: { type: String, ref: "user" },
    category: {type: String, ref: "category"},
  },
  { timestamps: true }
);

const Post = mongoose.models.post || mongoose.model("post", postSchema);

export default Post;
