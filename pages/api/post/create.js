import db from "../configs/connectDB";
import Post from "../models/postModel";
import Image from "../models/imageModel";
import TagLookup from "../models/tagLookupModel";
import { verifyAccessToken } from "../helpers/verifyToken";
import { handleValidate } from "./middleware";

db();

export default async function (req, res) {
  switch (req.method) {
    case "POST": {
      await create(req, res);
      break;
    }
  }
}

async function create(req, res) {
  try {
    const auth = await verifyAccessToken(req.headers);
    const { user } = auth;

    if (user.role !== "admin")
      return res.status(403).json({
        code: 403,
        message: "Bạn không có quyền tạo bài viết",
      });
    const {
      title,
      url,
      description,
      tags,
    } = req.body;

    const validate = await handleValidate({ title, url, description });

    if (validate) return res.status(validate.code).json({ ...validate });

    const newPost = await Post.create({ ...req.body });

    for(let item of tags.split(",")) {
        await TagLookup.create({postId: newPost._id, tagId: item})
    }

    return res.status(200).json({
      code: 200,
      message: "Tạo bài viết thành công",
    });
  } catch (err) {
    if (err.code) return res.status(err.code).json({ ...err });
    return res.status(500).json({
      code: 500,
      message: err.message,
    });
  }
}
