import db from "../configs/connectDB";
import Tag from "../models/tagModel";
import TagLookup from "../models/tagLookupModel";
import Post from "../models/postModel";
import Image from "../models/imageModel";
import User from "../models/userModel";

db();

export default async function (req, res) {
  switch (req.method) {
    case "GET": {
      await get(req, res);
      break;
    }
  }
}

async function get(req, res) {
  try {
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const _sort = () => {
      const { sort } = req.query;
      if (!sort) return { createdAt: "desc" };
      const sortArray = sort.split(",");
      return { [sortArray[0]]: sortArray[1] };
    };
    const skip = (page - 1) * limit;
    const { slug } = req.query;
    const tagId = slug.split(".")[1];

    const tag = await Tag.findById(tagId, "name url description");

    if (!tag)
      return res.status(404).json({
        code: 404,
        message: "Xin lỗi, danh mục bài viết này không tồn tại",
      });

    const tagLookups = await TagLookup.find({ tagId: tagId }).populate({
      path: "postId",
      match: { isPublish: true },
    });

    const postIds = tagLookups.map((tagLookup) => tagLookup.postId);

    const posts = await Post.find(
      { _id: { $in: postIds }, isPublish: true },
      "-__v -createdAt -updatedAt"
    )
      .populate({ path: "category", select: "name url" })
      .populate({ path: "image", select: "url alt title" })
      .populate({ path: "author", select: "fullName avatar" })
      .limit(limit)
      .skip(skip)
      .sort(_sort());

    const count = await Post.countDocuments({ _id: { $in: postIds } });

    return res.status(200).json({
      code: 200,
      posts: [...posts],
      count,
      tag,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      code: 500,
      message: "Lỗi máy chủ",
    });
  }
}
