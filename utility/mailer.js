const nodemailer = require('nodemailer');
console.log("EMAIL:", process.env.user);
console.log("PASSWORD:", process.env.pass ? "SET" : "NOT SET");
const sendCertificate = async (recipientEmail, recipientName, pdfBuffer) => {
    const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    logger: true,
    debug: true,
    auth: {
        user: process.env.user,
        pass: process.env.pass
    },
});

    const mailOptions = {
        from: `"CertiGen System" <${process.env.user}>`,
        to: recipientEmail,
        subject: `Certificate of Achievement - ${recipientName}`,
        text: `Certificate attached`,
        attachments: [
            {
                filename: `${recipientName}_Certificate.pdf`,
                content: pdfBuffer 
            }
        ]
    };

    return transporter.sendMail(mailOptions);
};

module.exports = sendCertificate;
