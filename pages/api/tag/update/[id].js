import db from "../../configs/connectDB";
import Tag from "../../models/tagModel";
import { verifyAccessToken } from "../../helpers/verifyToken";
import { tagValidate } from "../middleware";

db();

export default async function (req, res) {
  switch (req.method) {
    case "PUT": {
      await update(req, res);
      break;
    }
  }
}

async function update(req, res) {
  try {
    console.log(req.body)
    const auth = await verifyAccessToken(req.headers);
    const { id } = req.query;
    const { user } = auth;

    if (user.role !== "admin")
      return res.status(403).json({
        code: 403,
        message: "Bạn không có quyền sửa tag",
      });

    const validate = await tagValidate({ ...req.body });

    if (validate) return res.status(validate.code).json({ ...validate });

    await Tag.findByIdAndUpdate(id, { ...req.body });

    return res
      .status(200)
      .json({ code: 200, message: "Sửa tag thành công" });
  } catch (err) {
    if (err.code) return res.status(err.code).json({ ...err });
    return res.status(500).json({ code: 500, message: "Lỗi máy chủ" });
  }
}
