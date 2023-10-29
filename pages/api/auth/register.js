import db from "../configs/connectDB";
import User from "../models/userModel";
import * as middleware from "./middleware";
import bcrypt from "bcryptjs";
import { sendVerifyEmail } from "../configs/mailer";

db();

export default async function (req, res) {
  switch (req.method) {
    case "POST": {
      await register(req, res);
      break;
    }
  }
}

async function register(req, res) {
  try {
    const validate = await middleware.registerValidate(req.body);

    if (validate) return res.status(422).json(validate);

    const userByEmail = await User.findOne({ email: req.body.email });

    if (userByEmail) {
      return res.status(400).json({
        code: 400,
        message: "Email đã tồn tại, vui lòng chọn một email khác",
      });
    }

    const salt = bcrypt.genSaltSync(10);

    const hashPassword = bcrypt.hashSync(req.body.password, salt);

    const newUser = await User.create({ ...req.body, password: hashPassword });

    await sendVerifyEmail({ email: req.body.email, userId: newUser._id });

    return res.status(200).json({
      code: 200,
      message: "Đăng ký thành công",
    });
  } catch (err) {
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
}
