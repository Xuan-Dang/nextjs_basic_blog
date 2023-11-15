import db from "../../configs/connectDB";
import Post from "../../models/postModel";
import Tag from "../../models/tagModel";
import TagLookup from "../../models/tagLookupModel";
import Category from "../../models/categoryModel";
import User from "../../models/userModel";
import { verifyAccessToken } from "../../helpers/verifyToken";

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
    const { id } = req.query;
    console.log(id)
    const auth = await verifyAccessToken(req.headers);
    const { user } = auth;
    if (user.role !== "admin")
      return res.status(403).json({
        code: 403,
        message: "Bạn không có quyền quản lý bài viết",
      });
    const post = await Post.findById(id)
      .populate("author", "fullName avatar")
      .populate("category", "name url")
      .populate("image", "url alt title");
    if (!post)
      return res.status(404).json({
        code: 404,
        message: "không tìm thấy bài viết",
      });
    const tags = await TagLookup.find(
      { postId: post._id },
      "-postId -_id -__v -createdAt -updatedAt"
    ).populate("tagId", "name url");
    return res.status(200).json({
      code: 200,
      post: { ...post._doc, tags: [...tags] },
    });
  } catch (err) {
    console.log(err)
    if (err.code) return res.status(err.code).json({ ...err });
    return res.status(500).json({
      code: 500,
      message: "Lỗi máy chủ",
    });
  }
}
