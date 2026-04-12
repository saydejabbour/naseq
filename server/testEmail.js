import nodemailer from "nodemailer";

const testEmail = async () => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "rehamaassar@gmail.com",
        pass: "qyklwqvayqcbzbmx",
      },
    });

    await transporter.verify();
    console.log("✅ SMTP READY");

    const info = await transporter.sendMail({
      from: `"Naseq" <rehamaassar@gmail.com>`,
      to: "rehamaassar@gmail.com",
      subject: "TEST EMAIL",
      html: "<h1>It works 🎉</h1>",
    });

    console.log("✅ EMAIL SENT:", info.response);

  } catch (err) {
    console.error("❌ ERROR:", err);
  }
};

// 🔥 THIS LINE WAS MISSING
testEmail();