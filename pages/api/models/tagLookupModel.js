import mongoose from "mongoose";

const tagLookupSchema = new mongoose.Schema(
  {
    postId: { type: String, required: true },
    tagId: { type: String, required: true },
  },
  { timestamps: true }
);

const TagLookup =
  mongoose.models.tag_lookup || mongoose.model("tag_lookup", tagLookupSchema);

export default TagLookup;
