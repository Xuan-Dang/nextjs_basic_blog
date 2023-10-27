import db from "../configs/connectDB";
import User from "../models/userModel";
import bcrypt, { hash } from "bcryptjs";
import { loginValidate } from "./middleware";

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
    const { bodyEmail, bodyPassword } = req.body;
    const validate = await loginValidate({ bodyEmail, bodyPassword });
    if (validate) return res.status(422).json(validate);
    const userByEmail = await User.findOne({ email: bodyEmail });
    if (!userByEmail)
      return res.status(400).json({
        code: 400,
        message: "Email không chính xác, vui lòng kiểm tra lại",
      });
    const isMatch = bcrypt.compareSync(bodyPassword, userByEmail.password);
    if (!isMatch)
      return res.status(422).json({
        code: 400,
        message: "Mật khẩu không chính xác, vui lòng kiểm tra lại",
      });
    const { password, verifyToken, verifyTokenExpiry, ...user } = userByEmail;
    return res.status(200).json({
      code: 200,
      user: user,
    });
  } catch (err) {
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
}
