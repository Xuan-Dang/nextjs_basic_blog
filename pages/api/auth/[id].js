import db from "../configs/connectDB";
import User from "../models/userModel";

db();

export default async function (req, res) {
  switch (req.method) {
    case "GET": {
      await getUserById(req, res);
      break;
    }
  }
}

async function getUserById(req, res) {
  try {
    const { id } = req.query;
    const userById = await User.findById(id, "fullName avatar email role");

    if (!userById)
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy người dùng này",
      });

    return res.status(200).json({
      code: 200,
      user: { ...userById._doc },
    });
  } catch (err) {
    console.log(err);
    if (err.code) return res.status(err.code).json({ ...err });
    return res.status(500).json({
      code: 500,
      message: "Lỗi máy chủ",
    });
  }
}
