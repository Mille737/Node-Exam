const nodemailer = require("nodemailer");

const sendMail = async () => {

    let account = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: account.user,
            pass: account.pass,
        },
    });

    let info = await transporter.sendMail({
        from: '"John Doe" <jd@example.com>',
        to: "user@example.com",
        subject: "User Confirmation",
        text: "Your user was created",
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

module.exports = {sendMail};
