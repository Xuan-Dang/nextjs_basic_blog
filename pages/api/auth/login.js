import db from "../configs/connectDB";
import User from "../models/userModel";
import bcrypt, { hash } from "bcryptjs";
import { loginValidate } from "./middleware";
import {
  createAccessToken,
  createRefreshToken,
} from "../helpers/generateToken";

db();

export default async function (req, res) {
  switch (req.method) {
    case "POST": {
      await login(req, res);
      break;
    }
  }
}

async function login(req, res) {
  try {
    const bodyEmail = req.body.email;
    const bodyPassword = req.body.password;

    const validate = await loginValidate({
      email: bodyEmail,
      password: bodyPassword,
    });

    if (validate) return res.status(validate.code).json(validate);

    const userByEmail = await User.findOne({ email: bodyEmail });

    if (!userByEmail)
      return res.status(400).json({
        code: 400,
        message: "Email không chính xác, vui lòng kiểm tra lại",
      });

    const isMatch = bcrypt.compareSync(bodyPassword, userByEmail.password);

    if (!isMatch)
      return res.status(400).json({
        code: 400,
        message: "Mật khẩu không chính xác, vui lòng kiểm tra lại",
      });

    if (!userByEmail.isVerified) {
      return res.status(400).json({
        code: 400,
        message:
          "Địa chỉ email của bạn chưa được xác thực, vui lòng kiểm tra và xác thực email rồi quay lại đăng nhập.",
      });
    }

    const {
      password,
      verifyToken,
      verifyTokenExpiry,
      createdAt,
      updatedAt,
      __v,
      isVerified,
      ...user
    } = userByEmail._doc;

    const accessToken = await createAccessToken({ userId: user._id });
    const refreshToken = await createRefreshToken({ userId: user._id });

    return res.status(200).json({
      code: 200,
      user: { ...user, accessToken, refreshToken },
    });
  } catch (err) {
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
}
