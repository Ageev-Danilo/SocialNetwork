import emailjs from '@emailjs/browser';

//туть
const SERVICE_ID = 'your_service_id';
const TEMPLATE_ID = 'your_template_id';
const PUBLIC_KEY = 'your_public_key';

export function generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendVerificationEmail(
    toEmail: string,
    code: string
): Promise<void> {
    await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
            to_email: toEmail,
            verification_code: code,
        },
        PUBLIC_KEY
    );
}