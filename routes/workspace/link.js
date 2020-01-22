const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

// /:code/link/
router.post("/", async (req, res, next) => {
  const { email } = req.body;
  const { code } = req;

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USER, // 발송 메일 주소
    to: email, // 수신 메일 주소
    subject: "Slack Workspace 초대", // 제목
    text: `
    ${req.user.name}님이 초대했습니다.
    ${process.env.URL}/link/${code}`, // 내용
  };

  transport.sendMail(mailOptions, error => {
    if (error) {
      next(error);
    }
  });
  res.send("OK");
});

module.exports = router;
