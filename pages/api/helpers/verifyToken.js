import User from "../models/userModel";
import jwt from "jsonwebtoken";
import { createAccessToken } from "./generateToken";

export function verifyAccessToken(headers) {
  return new Promise((resolve, reject) => {
    const { authorization } = headers;

    if (!authorization)
      return reject({
        code: 400,
        message: "Vui lòng đăng nhập để thực hiện thao tác này",
      });

    jwt.verify(
      authorization,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decode) => {
        console.log(err);
        try {
          if (err && err.message === "jwt expired")
            return reject({ code: 400, message: err.message });
          if (err)
            return reject({
              code: 400,
              message: "Token không hợp lệ",
            });
          const userById = await User.findOne({ _id: decode.userId });

          if (!userById)
            return reject({
              code: 404,
              message: "Không tìm thấy người dùng",
            });

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

          return resolve({
            user: { ...user },
          });
        } catch (err) {
          if (err)
            return reject({
              code: 500,
              message: "Lỗi máy chủ",
            });
        }
      }
    );
  });
}

export function verifyRefreshToken(body) {
  return new Promise((resolve, reject) => {
    const { refreshToken } = body;

    if (!refreshToken)
      return reject({
        code: 400,
        message: "Vui lòng đăng nhập để tiếp tục",
      });

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decode) => {
        try {
          if (err && err.message === "rf_token expired")
            return reject({
              code: 400,
              message: err.message,
            });

          if (err)
            return reject({
              code: 400,
              message: "Token không hợp lệ",
            });

          const userById = await User.findOne({ _id: decode.userId });

          if (!userById)
            return reject({
              code: 404,
              message: "Không tìm thấy người dùng",
            });

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

          const newAccessToken = await createAccessToken({ userId: user._id });

          return resolve({
            accessToken: newAccessToken,
            user: { ...user },
          });
        } catch (err) {
          if (err)
            return reject({
              code: 500,
              message: "Lỗi máy chủ",
            });
        }
      }
    );
  });
}
