import nodemailer from "nodemailer";
import User from "../models/userModel";
import bcrypt from "bcryptjs";

export const sendVerifyEmail = async ({ email, userId }) => {
  try {
    const hashedToken = await bcrypt.hash(userId.toString(), 10);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: true,
      auth: {
        user: "dangthanhxuan8497@gmail.com",
        password: "zhychcnjdqapzhan",
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
