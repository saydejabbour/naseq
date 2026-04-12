import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "rehamaassar@gmail.com",
      pass: "qyklwqvayqcbzbmx",
    },
  });

  // ✅ verify connection
  await transporter.verify();
  console.log("✅ SMTP READY");

  const info = await transporter.sendMail({
    from: `"Naseq" <rehamaassar@gmail.com>`,
    to,
    subject,
    html,
  });

  console.log("✅ EMAIL SENT:", info.response);

  return info; // 🔥 IMPORTANT
};