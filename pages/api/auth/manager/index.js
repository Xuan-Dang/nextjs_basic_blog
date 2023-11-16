import db from "../../configs/connectDB";
import User from "../../models/userModel";
import { verifyAccessToken } from "../../helpers/verifyToken";

db();

export default async function (req, res) {
  switch (req.method) {
    case "GET": {
      await get(req, res);
      break;
    }
  }
}

async function get(req, res) {
  try {
    const limit = req.query?.limit || 10;
    const page = req.query?.page || 1;
    const sort = req.query?.sort || "desc";
    const skip = (page - 1) * limit;
    const auth = await verifyAccessToken(req.headers);
    const { user } = auth;

    if (user?.role !== "admin")
      return res.status(403).json({
        code: 403,
        message: "Bạn không có quyền xem danh sách người dùng",
      });

    const users = await User.find(
      {},
      "-__v -resetPasswordToken -resetPasswordTokenExpiry -verifyToken -verifyTokenExpiry"
    )
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: sort });

    const count = await User.find({}).count();

    return res.status(200).json({ code: 200, users, count });
  } catch (err) {
    if (err.code) return res.status(err.code).json({ ...err });
    return res.status(500).json({ code: 500, message: "Lỗi máy chủ" });
  }
}
