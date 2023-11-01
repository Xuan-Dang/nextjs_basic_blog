import db from "../configs/connectDB";
import Post from "../models/postModel";
import User from "../models/userModel";
import Category from "../models/categoryModel";
import Tag from "../models/tagModel";
import TagLookup from "../models/tagLookupModel";

db();

export default async function (req, res) {
  switch (req.method) {
    case "GET": {
      await getSinglePost(req, res);
      break;
    }
  }
}

async function getSinglePost(req, res) {
  try {
    const { id } = req.query;
    const postById = await Post.findById(id, "-__v -createdAt -updatedAt")
      .populate("author", "fullName avatar")
      .populate("category", "name url");

    if (!postById)
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy bài viết này",
      });

    const tags = await TagLookup.find({ postId: postById._id }, "-postId -_id -__v -createdAt -updatedAt").populate(
      "tagId",
      "name url"
    );

    return res.status(200).json({
      code: 200,
      post: {...postById._doc, tags: [...tags]},
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      code: 500,
      message: "Lỗi máy chủ",
    });
  }
}
