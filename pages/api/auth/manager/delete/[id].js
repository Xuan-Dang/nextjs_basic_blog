import db from "@/pages/api/configs/connectDB";
import User from "@/pages/api/models/userModel";
import { verifyAccessToken } from "@/pages/api/helpers/verifyToken";

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
      return res.status(403).message({
        code: 403,
        message: "Bạn không có quyền xóa người dùng",
      });

    if (user._id.toString() === id)
      return res.status(400).json({
        code: 400,
        message: "Bạn không thể xóa chính mình",
      });

    const userById = await User.findById(id);

    if (userById?.expireAt)
      return res.status(400).json({
        code: 400,
        message: "Người dùng này đã được lên lịch xóa",
      });

    if (userById.isVerified) {
      const date = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      await User.collection.createIndex(
        { expireAt: 1 },
        { expireAfterSeconds: 0 }
      );

      await User.findByIdAndUpdate(id, {
        isActive: false,
        expireAt: date,
      });

      return res.status(200).json({
        code: 200,
        message:
          "Do tài khoản này đã được xác thực nên sẽ được xóa sau 30 ngày kể từ bây giờ",
      });
    }

    await user.findByIdAndDelete(id);

    return res.status(200).json({
      code: 200,
      message: "Xóa người dùng thành công",
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
