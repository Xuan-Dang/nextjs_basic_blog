import db from "../configs/connectDB";
import Tag from "../models/tagModel";

db();

export default async function (req, res) {
  switch (req.method) {
    case "GET": {
      await show(req, res);
      break;
    }
  }
}

async function show(req, res) {
  try {
    const sort = req.query?.sort || "desc";
    const limit = req.query?.limit || 10;
    const page = req.query?.page || 1;
    const skip = (page - 1) * limit;

    const tags = await Tag.find({}, "-__v -createdAt -updatedAt")
      .sort({ createdAt: sort })
      .limit(limit)
      .skip(skip);

    const count = await Tag.find({}).count();
    
    return res.status(200).json({
      code: 200,
      tags,
      count,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      code: 500,
      message: "Lỗi máy chủ",
    });
  }
}
