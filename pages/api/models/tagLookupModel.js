import mongoose from "mongoose";

const tagLookupSchema = new mongoose.Schema(
  {
    postId: { type: String, required: true, ref: "post" },
    tagId: { type: String, required: true, ref: "tag" },
  },
  { timestamps: true }
);

const TagLookup =
  mongoose.models.tag_lookup || mongoose.model("tag_lookup", tagLookupSchema);

export default TagLookup;
