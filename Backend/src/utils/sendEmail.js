import nodemailer from 'nodemailer';

const sendEmail = async (to, subject, text,html,attachments = []) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Bookify 🎟️" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
    attachments
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
