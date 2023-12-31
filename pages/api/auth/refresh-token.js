import db from "../configs/connectDB";
import { verifyRefreshToken } from "../helpers/verifyToken";

db();

export default async function (req, res) {
  try {
    const verifyToken = await verifyRefreshToken(req.body);

    if (verifyToken.error)
      return res.status(403).json({
        code: 403,
        message: verifyToken.error,
      });

    res.status(200).json({
      code: 200,
      user: { ...verifyToken.user, accessToken: verifyToken.accessToken },
    });
  } catch (err) {
    console.log("err: ", err);
    if (err.code) return res.status(err.code).json(err);
    return res.status(500).json({
      code: 500,
      message: "Lỗi máy chủ",
    });
  }
}
