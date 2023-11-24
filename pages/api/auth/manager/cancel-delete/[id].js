import db from "@/pages/api/configs/connectDB";
import User from "@/pages/api/models/userModel";
import { verifyAccessToken } from "@/pages/api/helpers/verifyToken";

db();

export default async function (req, res) {
  switch (req.method) {
    case "PATCH": {
      await patch(req, res);
      break;
    }
  }
}

async function patch(req, res) {
  try {
    const { id } = req.query;
    const auth = await verifyAccessToken(req.headers);
    const { user } = auth;

    if (user.role !== "admin")
      return res.status(403).message({
        code: 403,
        message: "Bạn không có quyền hủy xóa người dùng",
      });

    const userById = await User.findById(id);

    if (!userById?.expireAt)
      return res.status(400).json({
        code: 400,
        message: "Người dùng này chưa được lên lịch xóa",
      });

    await User.findByIdAndUpdate(id, {
      expireAt: null,
    });

    return res.status(200).json({
      code: 200,
      message: "Hủy xóa người dùng thành công",
    });
  } catch (err) {
    console.log(err);
    if (err.code) return res.status(err.code).json({ ...err });
    return res.status(500).json({
      code: 500,
      message: "Lỗi máy chủ",
    });
  }
}
