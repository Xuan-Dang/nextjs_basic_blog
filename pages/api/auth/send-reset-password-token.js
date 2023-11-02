import db from "../configs/connectDB";
import User from "../models/userModel";
import { sendResetPasswordEmail } from "../configs/mailer";
import { sendResetPasswordTokenValidate } from "./middleware";

db();

export default async function (req, res) {
  switch (req.method) {
    case "POST": {
      await sendResetPasswordToken(req, res);
      break;
    }
  }
}

async function sendResetPasswordToken(req, res) {
  try {
    const { email } = req.body;
    const validate = await sendResetPasswordTokenValidate({ email });

    if (validate) return res.status(validate.code).json({ ...validate });

    const userByEmail = await User.findOne({ email: email });
    if (!userByEmail)
      return res.status(404).json({
        code: 404,
        message: "Email không chính xác, vui lòng thử lại",
      });

    await sendResetPasswordEmail({ email, userId: userByEmail._id });

    return res.status(200).json({
      code: 200,
      message:
        "Chúng tôi đã gửi một liên kết đến email của bạn. Hãy kiểm tra email và vào liên kết đó để lấy lại mật khẩu",
    });
  } catch (err) {
    return res.statsu(500).json({
      code: 500,
      message: "Lỗi máy chủ",
    });
  }
}
