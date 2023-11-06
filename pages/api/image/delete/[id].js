import db from "../../configs/connectDB";
import Image from "../../models/imageModel";
import { verifyAccessToken } from "../../helpers/verifyToken";
import fs from "fs";

db();

export default async function (req, res) {
  switch (req.method) {
    case "DELETE": {
      await deleteImage(req, res);
      break;
    }
  }
}

async function deleteImage(req, res) {
  try {
    const checkAuth = await verifyAccessToken(req.headers);
    const { user } = checkAuth;
    const { id } = req.query;
    const ids = id.split(",");
    for (let id of ids) {
      const image = await Image.findById(id);
      let unlinkError = "";
      if (!image)
        return res.status(404).json({
          code: 404,
          message: `Hình ảnh ${id} không tồn tại`,
        });
      if (user._id !== image.user && user.role !== "admin")
        return res.status(403).json({
          code: 403,
          message: `Bạn không có quyền xóa hình ảnh ${id}`,
        });
      fs.unlink(`./public/${image.url}`, (err) => {
        if (err) return (unlinkError = err.message);
      });
      if (unlinkError)
        return res.status(500).json({
          code: 500,
          message: "Xóa ảnh thất bại",
        });
      await Image.findByIdAndDelete(id);
    }
    return res.status(200).json({
      code: 200,
      message: "Xóa hình ảnh thành công",
    });
  } catch (err) {
    console.log(err);
    if (err.code) return res.status(res.code).json(err);
    return res.status(500).json({
      code: 500,
      message: "Lỗi máy chủ",
    });
  }
}
