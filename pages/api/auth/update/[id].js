import db from "../../configs/connectDB";
import User from "../../models/userModel";
import { verifyAccessToken } from "../../helpers/verifyToken";
import { updateUserByIdValidate } from "../middleware";
import bcrypt from "bcryptjs";

db();

export default async function (req, res) {
  switch (req.method) {
    case "PUT": {
      await updateUserById(req, res);
      break;
    }
  }
}

async function updateUserById(req, res) {
  try {
    const { id } = req.query;
    const { avatar, fullName, email, password, confirmPassword } = req.body;

    const checkAuth = await verifyAccessToken(req.headers);

    const { user } = checkAuth;

    if (user._id.toString() !== id && user.role !== "admin")
      return res.status(403).json({
        code: 403,
        message: "Bạn không có quyền thay đổi thông tin của người dùng này",
      });

    const validate = await updateUserByIdValidate({
      fullName,
      email,
      password,
      confirmPassword,
    });

    if (validate) return res.status(validate.code).json(validate);

    const userById = await User.findById(id);

    if (!userById)
      return res.statsu(404).json({
        code: 404,
        message: "Không tìm thấy người dùng yêu cầu",
      });

    if (email !== userById.email)
      return res
        .statsu(403)
        .json({ code: 403, message: "Email không được thay đổi" });

    const salt = bcrypt.genSaltSync(10);

    await User.findByIdAndUpdate(id, {
      avatar: avatar ? avatar : userById.avatar,
      fullName: fullName ? fullName : userById.fullName,
      password: password ? bcrypt.hashSync(password, salt) : userById.password,
    });

    return res.status(200).json({
      code: 200,
      message: "Cập nhật thông tin người dùng thành công",
    });
  } catch (err) {
    if (err.code) return res.status(err.code).json(err);
    return res.status(500).json({
      code: 500,
      message: "Lỗi máy chủ",
    });
  }
}
