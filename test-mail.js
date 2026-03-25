const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "coutsaigon1234@gmail.com",
    pass: "MLZLEPUCMITGYLPT" // App Password
  },
  tls: { rejectUnauthorized: false }
});

const mailOptions = {
  from: '"Fruit Shop" <coutsaigon1234@gmail.com>',
  to: "lanvihuynh79@gmail.com",
  subject: "Test Nodemailer",
  text: "Nếu nhận được mail này là nodemailer ok!"
};

transporter.sendMail(mailOptions, (err, info) => {
  if(err) console.log("Lỗi:", err);
  else console.log("Mail gửi thành công:", info.response);
});