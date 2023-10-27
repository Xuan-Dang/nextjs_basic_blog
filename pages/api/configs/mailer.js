import nodemailer from "nodemailer";
import User from "../models/userModel";
import bcrypt from "bcryptjs";

export const sendVerifyEmail = async ({ email, userId }) => {
  try {
    const hashedToken = await bcrypt.hash(userId.toString(), 10);

    await User.findByIdAndUpdate(userId, {
      verifyToken: hashedToken,
      verifyTokenExpiry: Date.now() + 360000,
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: "dangthanhxuan8497@gmail.com",
        clientId:
          "586384927300-m5u3mbelts81l7q8egq84slh2dfmric9.apps.googleusercontent.com",
        clientSecret: "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",
        refreshToken:
          "1//04F7Cs_FgJSc-CgYIARAAGAQSNwF-L9IrX69Z4eo-tU4aRUaoLBK3gpuVgCOaOUhLfDBYeJoOzEHPhVxbHSuxoFsof7mGkbbUTEc",
        accessToken:
          "ya29.a0AfB_byDfZ3lSAA2xgV6_sDKQtx-2C3hntVK9UMNeKohU4jdfPNhBB69fuaBlEZ7hcCDavlFDiJnJKaPENZldbLgyD5AhoTLOlBX9ypp4M7SzbUHACQPei-ItUwJig8hbre_SqO0AvMJyzl_krtV_d4BdO5ykv_fExpZ_aCgYKAd0SARISFQGOcNnCYl0a-TzeA2_ESiBx4Wsl8Q0171",
      },
    });

    const mailOption = {
      from: "dangthanhxuan8497@gmail.com",
      to: email,
      subject: "Xác thực email của bạn",
      html: `
        <p>
          Vui lòng vào đường dẫn sau để xác thực email của bạn: ${process.env.BASE_URL}/verify-email?token=${hashedToken}
        </p>
      `,
    };

    const sendEmailResponse = await transporter.sendMail(mailOption);

    return sendEmailResponse;
  } catch (error) {
    console.log("Send verify email error: ", error);
    throw new Error(error.message);
  }
};
