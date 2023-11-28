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
    const _sort = () => {
      const { sort } = req.query;
      if (!sort) return { createdAt: "desc" };
      const sortArray = sort.split(",");
      return { [sortArray[0]]: sortArray[1] };
    };
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    if (search) {
      const posts = await Post.find(
        { isPublish: true, title: { $regex: new RegExp(search, "i") } },
        "-__v -createdAt -updatedAt"
      )
        .populate({ path: "category", select: "name url" })
        .populate({ path: "image", select: "url alt title" })
        .populate({ path: "author", select: "fullName avatar" })
        .limit(limit)
        .skip(skip)
        .sort(_sort());
      const count = await Post.find({ isPublish: true, title: { $regex: new RegExp(search, "i") } }).count()
      if (posts.length === 0)
        return res.status(404).json({
          code: 404,
          message: "Xin lỗi, chúng tôi không tìm thấy bài viết bạn yêu cầu",
        });
      return res.status(200).json({
        code: 200,
        message: `Kết quả tìm kiếm cho ${search}`,
        posts,
        count
      });
    }
    const posts = await Post.find(
      { isPublish: true },
      "-__v -createdAt -updatedAt"
    )
      .populate({ path: "category", select: "name url" })
      .populate({ path: "image", select: "url alt title" })
      .populate({ path: "author", select: "fullName avatar" })
      .limit(limit)
      .skip(skip)
      .sort(_sort());
    const count = await Post.find({ isPublish: true }).count();
    return res.status(200).json({
      code: 200,
      posts,
      count,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      code: 500,
      message: "Lỗi máy chủ",
    });
  }
}
