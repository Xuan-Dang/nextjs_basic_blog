import db from "../../configs/connectDB";
import Image from "../../models/imageModel";
import { verifyAccessToken } from "../../helpers/verifyToken";

db();

export default async function (req, res) {
  switch (req.method) {
    case "PUT": {
      await updateImage(req, res);
      break;
    }
  }
}

async function updateImage(req, res) {
  try {
    const checkAuth = await verifyAccessToken(req.headers);
    const { user } = checkAuth;
    if (user.role !== "admin")
      return res.status(403).json({
        code: 403,
        message: "Bạn không có quyền cập nhật thông tin hình ảnh",
      });
    const { id } = req.query;
    const image = req.body;
    await Image.findByIdAndUpdate(id, { ...image });
    return res.status(200).json({
      code: 200,
      message: "Cập nhật thông tin hình ảnh thành công",
    });
  } catch (err) {
    if (err.code) return res.status(err.code).json({ ...err });
    return res.statsu(500).json({
      code: 500,
      message: "Lỗi máy chủ",
    });
  }
}
