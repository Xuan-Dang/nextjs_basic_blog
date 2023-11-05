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
    console.log(id);
    const image = await Image.findById(id);
    if (!image)
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy hình ảnh cần xóa",
      });
    console.log(user._id);
    console.log(image.user);
    if (user.role !== "admin" && user._id.toString() !== image.user)
      return res.status(403).json({
        code: 403,
        message: "Bạn không có quyền xóa hình ảnh này",
      });

    const deleteFileStatus = fs.unlink(
      `./public${image.url}`,
      function (error) {
        if (error) return error;
        return null;
      }
    );

    if (deleteFileStatus)
      return res
        .status(500)
        .json({ code: 500, message: "Xóa ảnh không thành công" });

    await Image.findByIdAndDelete(id);
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
