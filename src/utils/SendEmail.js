import nodemailer from "nodemailer";

async function sendEmail({
  to = [],
  cc,
  bcc,
  subject,
  text,
  html,
  attachments,
} = {}) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let info = await transporter.sendMail({
    from: `"Mohamed Elmesery" <${process.env.EMAIL}>`,
    to,
    subject,
    text,
    cc,
    bcc,
    html,
    attachments,
  });
  return info.rejected.length ? false : true;
}

export default sendEmail;
