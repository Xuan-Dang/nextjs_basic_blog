import db from "../configs/connectDB";
import Post from "../models/postModel";
import Category from "../models/categoryModel";

db();

export default async function (req, res) {
  switch (req.method) {
    case "GET": {
      await getAllPost(req, res);
      break;
    }
  }
}

async function getAllPost(req, res) {
  try {
    const posts = await Post.find(
      { isPublish: true },
      "-__v -createdAt -updatedAt"
    ).populate({ path: "category", select: "name url" });
    return res.status(200).json({
      code: 200,
      posts,
    });
  } catch (err) {
    console.log("err: ", err);
    return res.status(500).json({
      code: 500,
      message: "Lỗi máy chủ",
    });
  }
}
