import nodemailer from "nodemailer";
import { Logging } from "./Logging";

const mailTransporter = async ({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: any;
}) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "Gmail",
      port: 587,
      secure: true,
      auth: {
        user: process.env.AUTH_EMAIL as string,
        pass: process.env.AUTH_PASS as string,
      },
    });

    let mailOptions = {
      from: process.env.FRASER_EMAIL as string,
      to: to,
      subject: subject,
      text: text,
      html: html,
    };

    const sending = await transporter.sendMail(mailOptions);
    Logging.info(`email send to user ${sending}`);
  } catch (error: any) {
    Logging.error(
      `an error occoured while sending email ${error?.message || error}`
    );
  }
};

export {mailTransporter};
