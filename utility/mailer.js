const nodemailer = require('nodemailer');

const sendCertificate = async (recipientEmail, recipientName, pdfBuffer) => {
    const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.user,
        pass: process.env.pass
    },
    tls: {
        family: 4
    }
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
