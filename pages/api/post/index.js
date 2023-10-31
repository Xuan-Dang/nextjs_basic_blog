import db from "../configs/connectDB";
import postModel from "../models/postModel";

db();

export default async function (req, res) {
  switch (req.method) {
    case "GET": {
      return await getAllPost(req, res);
      break;
    }
  }
}

async function getAllPost(req, res) {
  try {
    const posts = await postModel
      .find({ isPublish: true }, "-__v -createdAt -updatedAt")
      .populate({ path: "category", select: "name url" });
    return res.status(200).json({
      code: 200,
      posts,
    });
  } catch (err) {
    return res.status(500).json({
      code: 500,
      message: "Lỗi máy chủ",
    });
  }
}
