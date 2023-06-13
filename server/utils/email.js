import { createTransport } from "nodemailer";
import ApiError from "./ApiError.js";
const sendEmail = async (options, next) => {
  try {
    const transporter = createTransport({
      host: process.env.SMTP_HOST_NAME,
      port: process.env.SMTP_HOST_PORT,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER_NAME,
        pass: process.env.SMTP_USER_PASS,
      },
    });
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER_NAME,
      to: options.email,
      subject: options.subject,
      html: options.html,
    });
    console.log(info);
    console.log("email sent successfully");
  } catch (err) {
    return next(new ApiError(500, "email couldn't send"));
  }
};

export default sendEmail;
