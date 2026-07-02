import nodeMailer from "nodemailer";

export const sendEmail = async ({ email, subject, message }) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
        connectionTimeout: 60000,
        greetingTimeout: 60000,
        socketTimeout: 60000,
    });

    // await transporter.verify();
    console.log("SMTP Connected Successfully");

    await transporter.sendMail({
        from: process.env.SMTP_MAIL,
        to: email,
        subject,
        html: message,
    });

    console.log("Email Sent Successfully");
};