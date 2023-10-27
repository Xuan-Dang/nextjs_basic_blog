import nodemailer from "nodemailer";
import User from "../models/userModel";
import bcrypt from "bcryptjs";

export const mailer = async ({ email, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: process.env.MAIL_USER,
        clientId: process.env.MAIL_CLIENT_ID,
        clientSecret: process.env.MAIL_CLIENT_SECRET,
        refreshToken: process.env.MAIL_REFRESH_TOKEN,
        accessToken: process.env.MAIL_ACCESS_TOKEN,
      },
    });

    const mailOption = {
      from: process.env.MAIL_USER,
      to: email,
      subject: subject,
      html: html,
    };

    const sendEmailResponse = await transporter.sendMail(mailOption);

    return sendEmailResponse;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const sendVerifyEmail = async ({ email, userId }) => {
  try {
    const hashedToken = await bcrypt.hash(userId.toString(), 10);

    await User.findByIdAndUpdate(userId, {
      verifyToken: hashedToken,
      verifyTokenExpiry: Date.now() + 360000,
    });

    const html = `
      <p>Vui lòng vào liên kết sau để xác thực email của bạn: ${process.env.BASE_URL}/verify-email?token=${hashedToken}</p>
    `;

    const verifyEmailResponse = await mailer({
      email: email,
      subject: "Xác thực địa chỉ email",
      html,
    });

    return verifyEmailResponse;
  } catch (error) {
    console.log("Send verify email error: ", error);
    throw new Error(error.message);
  }
};
