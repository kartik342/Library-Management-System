import { Resend } from "resend";

export const sendEmail = async ({ email, subject, message }) => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject,
        html: message,
    });
};