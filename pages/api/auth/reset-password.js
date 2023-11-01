import db from "../configs/connectDB";
import User from "../models/userModel";
import bcrypt from "bcryptjs";

db();

export default async function (req, res) {
  switch (req.method) {
    case "POST": {
      await resetPassword(req, res);
      break;
    }
  }
}

async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiry: { $gt: Date.now() },
    });

    if (!user)
      return res.status(404).json({
        code: 404,
        message: "Token không hợp lệ, vui lòng thử lại sau",
      });

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpiry = null;
    await user.save();

    return res.status(200).json({
      code: 200,
      message:
        "Bạn đã thay đổi mật khẩu thành công, bây giờ bạn có thể đăng nhập",
    });
  } catch (err) {
    console.log(err);
    return res.statsu(500).json({
      code: 500,
      message: "Lỗi máy chủ",
    });
  }
}
