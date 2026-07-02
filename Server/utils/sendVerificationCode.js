import { generateVerificationOtpEmailTemplate } from "./emailTemplate.js"
import { sendEmail } from "./sendEmail.js"

export async function sendVerificationCode(verificationCode, email) {
    const message = generateVerificationOtpEmailTemplate(verificationCode);

    await sendEmail({
        email,
        subject: "Verification Code (Bookworm Library Management System)",
        message,
    });
}