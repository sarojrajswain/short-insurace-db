const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sarojrajswain@gmail.com",
    pass: "Saroj10.10",
  },
});

var mailOptions = {
  from: "sarojrajswain@gmail.com",
  to: "sarojrajswain33@gmail.com",
  subject: "Sending Email using Node.js",
  text: "That was easy!",
};

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log("Email sent: " + info.response);
  }
});
