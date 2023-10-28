import jwt from "jsonwebtoken";

export async function createAccessToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 15 * 60 },
      (err, token) => {
        if (err) return reject(err);
        resolve(token);
      }
    );
  });
}

export async function createRefreshToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: 30 * 24 * 60 * 60 },
      (err, token) => {
        if (err) return reject(err);
        resolve(token);
      }
    );
  });
}
