import db from "../configs/connectDB";
import Tag from "../models/tagModel";
import { verifyAccessToken } from "../helpers/verifyToken";
import { tagValidate } from "./middleware";

db();

export default async function (req, res) {
  switch (req.method) {
    case "POST": {
      await create(req, res);
      break;
    }
  }
}

async function create(req, res) {
  try {
    const checkAuth = await verifyAccessToken(req.headers);

    const { user } = checkAuth;

    if (user.role !== "admin")
      return res.status(403).message({
        code: 403,
        message: "Bạn không được phép tạo tag",
      });

    const validate = await tagValidate({ ...req.body });

    if (validate) return res.status(validate.code).json({ ...validate });

    await Tag.create({ ...req.body });

    res.status(200).json({ code: 200, message: "Tạo tag thành công" });
  } catch (err) {
    if (err?.code) return res.statsu(err.code).json({ ...err });
    return res.status(500).json({
      code: 500,
      message: "Lỗi máy chủ",
    });
  }
}
