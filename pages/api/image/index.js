import db from "../configs/connectDB";
import Image from "../models/imageModel";
import { verifyAccessToken } from "../helpers/verifyToken";

db();

export default async function (req, res) {
  switch (req.method) {
    case "GET": {
      await getAllImage(req, res);
      break;
    }
  }
}

async function getAllImage(req, res) {
  try {
    const checkAuth = await verifyAccessToken(req.headers);
    const { user } = checkAuth;
    if (user.role === "admin") {
      const data = await Image.find({});
      return res.status(200).json({
        code: 200,
        images: data,
      });
    } else {
      const data = await Image.find({ user: user._id });
      return res.status(200).json({
        code: 200,
        images: data,
      });
    }
  } catch (err) {
    console.log(err);
    if (err.code) return res.status(err.code).json({ ...err });
    return res.status(500).json({ code: 500, message: "Lỗi máy chủ" });
  }
}
