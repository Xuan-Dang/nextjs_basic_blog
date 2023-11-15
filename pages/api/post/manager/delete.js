import db from "../../configs/connectDB";
import Post from "../../models/postModel";
import { verifyAccessToken } from "../../helpers/verifyToken";
import TagLookup from "../../models/tagLookupModel";

db();

export default async function (req, res) {
  switch (req.method) {
    case "DELETE": {
      await deleteById(req, res);
      break;
    }
  }
}

async function deleteById(req, res) {
  try {
    const { id } = req.query;
    const auth = await verifyAccessToken(req.headers);
    const { user } = auth;
    if (user.role !== "admin")
      return res.status(403).json({
        code: 403,
        message: "Bạn không có quyền xóa bài viết",
      });
    await TagLookup.deleteMany({postId: id})
    await Post.findByIdAndDelete(id);
    return res.status(200).json({
      code: 200,
      message: "Xóa bài viết thành công",
    });
  } catch (err) {
    if (err.code) return res.status(err.code).json({ ...err });
    return res.status(500).json({
      code: 500,
      message: "Lỗi máy chủ",
    });
  }
}
