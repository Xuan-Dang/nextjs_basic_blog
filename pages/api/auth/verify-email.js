import db from "../configs/connectDB";
import User from "../models/userModel";

db();

export default async function (req, res) {
  switch (req.method) {
    case "POST": {
      await verifyEmail(req, res);
      break;
    }
  }
}

async function verifyEmail(req, res) {
  try {
    const { token } = req.body;

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        code: 400,
        message: "Mã xác thực không hợp lệ",
      });
    }

    user.isVerified = true;
    user.verifyToken = null;
    user.verifyTokenExpiry = null;
    user.expireAt = null;
    await user.save();

    return res.status(200).json({
      code: 200,
      message: "Xác thực email thành công",
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
}
