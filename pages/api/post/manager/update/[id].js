import db from "../../../configs/connectDB";
import Post from "../../../models/postModel";
import Image from "../../../models/imageModel";
import TagLookup from "../../../models/tagLookupModel";
import { verifyAccessToken } from "../../../helpers/verifyToken";
import { handleValidate } from "../../middleware";

db();

export default async function (req, res) {
  switch (req.method) {
    case "PUT": {
      await update(req, res);
      break;
    }
  }
}

async function update(req, res) {
  try {
    const { id } = req.query;
    const auth = await verifyAccessToken(req.headers);
    const { user } = auth;
    
    console.log(req.body);

    if (user.role !== "admin")
      return res.status(403).json({
        code: 403,
        message: "Bạn không có quyền cập nhật viết",
      });
    const { title, url, description, tags } = req.body;

    const validate = await handleValidate({ title, url, description });

    if (validate) return res.status(validate.code).json({ ...validate });

    const postUpdated = await Post.findByIdAndUpdate(id, {
      ...req.body,
      author: user._id,
    });

    await TagLookup.deleteMany({ postId: postUpdated._id });

    const tagArray = JSON.parse(tags)

    if (tagArray && tagArray.length > 0)
      for (let item of tagArray) {
        await TagLookup.create({ postId: postUpdated._id, tagId: item.value });
      }

    return res.status(200).json({
      code: 200,
      message: "Cập nhật bài viết thành công",
    });
  } catch (err) {
    console.log(err);
    if (err.code) return res.status(err.code).json({ ...err });
    return res.status(500).json({
      code: 500,
      message: err.message,
    });
  }
}
