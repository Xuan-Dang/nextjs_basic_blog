import db from "../../configs/connectDB";
import Post from "../../models/postModel";
import Category from "../../models/categoryModel";
import Image from "../../models/imageModel";
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
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const sort = req.query.sort || "DESC";
    const skip = (page - 1) * limit;

    const auth = await verifyAccessToken(req.headers);

    const { user } = auth;

    if (user.role !== "admin")
      return res
        .status(403)
        .json({ code: 403, message: "Bạn không có quyền quản lý bài viết" });

    const posts = await Post.find({}, "-__v -createdAt -updatedAt")
      .populate({ path: "category", select: "name url" })
      .populate({ path: "image", select: "url alt title" })
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: sort });
    return res.status(200).json({
      code: 200,
      posts,
    });
  } catch (err) {
    if (err.code) return res.status(err.code).json({ ...err });
    return res.status(500).json({
      code: 500,
      message: "Lỗi máy chủ",
    });
  }
}
