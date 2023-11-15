import db from "../../configs/connectDB";
import Post from "../../models/postModel";
import { verifyAccessToken } from "../../helpers/verifyToken";

db();

export default async function (req, res) {
  switch (req.method) {
    case "PATCH": {
      await update(req, res);
      break;
    }
  }
}

async function update(req, res) {
  try {
    const { id } = req.query;
    const { isPublish } = req.body;
    const auth = await verifyAccessToken(req.headers);
    const { user } = auth;
    if (user.role !== "admin")
      return res.status(403).json({
        code: 403,
        message: "Bạn không có quyền cập nhật trạng thái bài viết",
      });
    await Post.findByIdAndUpdate(id, { isPublish: isPublish });
    return res.status(200).json({
      code: 200,
      message: "Cập nhật trạng thái bài viết thành công",
    });
  } catch (err) {
    if (err.code) return res.status(err.code).json({ ...err });
    return res.status(500).json({
      code: 500,
      message: "Lỗi máy chủ",
    });
  }
}
