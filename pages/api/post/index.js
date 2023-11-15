import db from "../configs/connectDB";
import Post from "../models/postModel";
import Category from "../models/categoryModel";
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
    const sort = req.query.sort || "DESC";
    const skip = (page - 1) * limit;

    const posts = await Post.find(
      { isPublish: true },
      "-__v -createdAt -updatedAt"
    )
      .populate({ path: "category", select: "name url" })
      .populate({ path: "image", select: "url alt title" })
      .populate({ path: "author", select: "fullName avatar" })
      .limit(limit)
      .skip(skip)
      .sort(sort);
    return res.status(200).json({
      code: 200,
      posts,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      code: 500,
      message: "Lỗi máy chủ",
    });
  }
}
