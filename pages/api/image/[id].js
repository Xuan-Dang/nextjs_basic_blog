import db from "../configs/connectDB";
import Image from "../models/imageModel";

db();

export default async function (req, res) {
  switch (req.method) {
    case "GET": {
      await getImageById(req, res);
      break;
    }
  }
}

async function getImageById(req, res) {
  try {
    const { id } = req.query;
    const image = await Image.findById(id, "-__v -updatedAt").populate(
      "user",
      "fullName"
    );
    if (!image)
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy hình ảnh",
      });
    return res.status(200).json({
      code: 200,
      image,
    });
  } catch (err) {
    return res.status(500).json({
      code: 500,
      message: "Lỗi máy chủ",
    });
  }
}
