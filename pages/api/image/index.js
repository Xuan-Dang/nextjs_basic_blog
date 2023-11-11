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
    const sort = req.query?.sort || "desc";
    const limit = req.query?.limit || 10;
    const page = req.query?.page || 1;
    const skip = (page - 1) * limit;
    const { user } = checkAuth;
    if (user.role === "admin") {
      const data = await Image.find({})
        .populate("user", "fullName")
        .sort({ createdAt: sort })
        .limit(limit)
        .skip(skip);
      const count = await Image.find({}).count();
      return res.status(200).json({
        code: 200,
        images: data,
        count,
      });
    } else {
      const data = await Image.find({ user: user._id })
        .limit(limit)
        .skip((page - 1) * limit);
      const count = await Image.find({ user: user._id }).count();
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
