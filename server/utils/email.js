import { createTransport } from "nodemailer";

const sendEmail = async (options, isEmailSent) => {
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
    isEmailSent = true;
  } catch (err) {
    isEmailSent = false;
  }
};

export default sendEmail;
