import nodeMailer from "nodemailer"

export const sendEmail = async({email, subject, message})=>{
    console.log({
        host: process.env.SMTP_HOST,
        service: process.env.SMTP_SERVICE,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_MAIL,
        passExists: !!process.env.SMTP_PASSWORD,
    });
    const transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        service: process.env.SMTP_SERVICE,
        port: process.env.SMTP_PORT,
        auth: { // for authentication of your email
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        }
    })
    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject,
        html: message, // user text: message (if your mail is in string )
    }

    console.log("Connecting to SMTP...");
    await transporter.verify();
    console.log("SMTP connected successfully");

    await transporter.sendMail(mailOptions)
}