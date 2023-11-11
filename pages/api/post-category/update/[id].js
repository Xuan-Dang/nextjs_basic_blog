import db from "../../configs/connectDB";
import Category from "../../models/categoryModel";
import { verifyAccessToken } from "../../helpers/verifyToken";
import { categoryValidate } from "../middleware";

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
    const auth = await verifyAccessToken(req.headers);
    const { id } = req.query;
    const { user } = auth;

    if (user.role !== "admin")
      return res.status(403).json({
        code: 403,
        message: "Bạn không có quyền sửa danh mục bài viết",
      });

    const validate = await categoryValidate({ ...req.body });

    if (validate) return res.status(validate.code).json({ ...validate });

    await Category.findByIdAndUpdate(id, { ...req.body });

    return res
      .status(200)
      .json({ code: 200, message: "Sửa danh mục bài viết thành công" });
  } catch (err) {
    if (err.code) return res.status(err.code).json({ ...err });
    return res.status(500).json({ code: 500, message: "Lỗi máy chủ" });
  }
}
