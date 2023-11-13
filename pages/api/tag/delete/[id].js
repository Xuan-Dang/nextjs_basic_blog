import db from "../../configs/connectDB";
import Tag from "../../models/tagModel";
import { verifyAccessToken } from "../../helpers/verifyToken";

db();

export default async function (req, res) {
  switch (req.method) {
    case "DELETE": {
      await destroy(req, res);
      break;
    }
  }
}

async function destroy(req, res) {
  try {
    const { id } = req.query;
    const auth = await verifyAccessToken(req.headers);
    const { user } = auth;

    if (user.role !== "admin")
      return res.status(403).json({
        code: 403,
        message: "Bạn không có quyền xóa tag",
      });

    await Tag.findByIdAndDelete(id);

    return res.status(200).json({
      code: 200,
      message: "Xóa tag thành công",
    });
  } catch (err) {
    if (err.code) return res.statsu(err.code).json({ ...err });
    return res.status(500).json({
      code: 500,
      message: "Lỗi máy chủ",
    });
  }
}
