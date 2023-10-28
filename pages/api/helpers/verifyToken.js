import User from "../models/userModel";
import jwt from "jsonwebtoken";
import { createAccessToken } from "./generateToken";
export async function verifyRefreshToken(body) {
  try {
    const { refreshToken } = body;

    if (!refreshToken)
      return {
        error: {
          code: 403,
          message: "Vui lòng đăng nhập",
        },
      };

    const result = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decode) => {
        if (err && err.message === "jwt expired") {
          return { error: err.mesasage };
        } else if (err) {
          return { error: "Token không hợp lệ, vui lòng đăng nhập lại" };
        }
        return { decode: decode };
      }
    );

    if (result.error) return { error: result.error };

    const userById = await User.findOne({ _id: result.decode.userId });

    if (!userById)
      return {
        error: {
          code: 404,
          message: "Không tìm thấy người dùng",
        },
      };

    const {
      __v,
      createdAt,
      updatedAt,
      verifyToken,
      verifyTokenExpiry,
      isVerified,
      password,
      ...user
    } = userById._doc;

    const accessToken = await createAccessToken({ userId: user._id });

    return { user: { ...user, accessToken } };
  } catch (err) {
    return { error: err.message };
  }
}
