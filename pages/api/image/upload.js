import db from "../configs/connectDB";
import fs from "fs";
import { IncomingForm } from "formidable";
import mv from "mv";
import { verifyAccessToken } from "../helpers/verifyToken";
import Image from "../models/imageModel";

db();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function (req, res) {
  switch (req.method) {
    case "POST": {
      await uploadImage(req, res);
      break;
    }
  }
}

const uploadData = (req, userRole, userId) => {
  return new Promise(async (resolve, reject) => {
    const form = new IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);

      const { images } = files;
      if (userRole !== "admin" && images.length > 1)
        return reject({
          code: 403,
          message:
            "Bạn không phải admin, không thể tải lên nhiều hơn 1 ảnh cùng lúc",
        });

      for (let image of images) {
        var oldPath = image.filepath;
        var newPath = `./public/images/${image.originalFilename}`;
        Image.create({
          url: `/images/${image.originalFilename}`,
          user: userId,
        });
        mv(oldPath, newPath, function (err) {
          return reject(err);
        });
      }

      resolve({ code: 200, message: "Tải ảnh lên thành công" });
    });
  });
};

async function uploadImage(req, res) {
  try {
    const checkAuth = await verifyAccessToken(req.headers);
    const { user } = checkAuth;
    const uploadResponse = await uploadData(req, user.role, user._id);
    return res.status(uploadResponse.code).json({ ...uploadResponse });
  } catch (err) {
    if (err.code) return res.status(err.code).json(err);
    return res.status(500).json({
      code: 500,
      message: "Lỗi máy chủ",
    });
  }
}
