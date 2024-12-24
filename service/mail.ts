import nodemailer from 'nodemailer';
import { PASS, USER } from '../env';

export function sendMail(to: string, subject: string, message: string) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
      user: USER,
      pass: PASS,
    },
    port: 465,
    secure: true,
  });

  const mailOption = {
    from: 'vincentalfarieco@gmail.com',
    to: to,
    subject: subject,
    html: message,
  };

  transporter.sendMail(mailOption, (err, info) => {
    if (err) {
      console.log(err);
    }

    console.log(info);
  });
}
