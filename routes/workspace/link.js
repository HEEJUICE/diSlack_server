const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

// /:code/link
router.post("/test", async (req, res, next) => {
  const { email } = req.body;
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "",
      pass: "",
    },
  });

  const mailOptions = {
    from: "user@gmail.com", // 발송 메일 주소
    to: email, // 수신 메일 주소
    subject: "Slack 초대 메일", // 제목
    text: "http://localhost:3000", // 내용
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
  res.send("Link Test");
});

module.exports = router;
