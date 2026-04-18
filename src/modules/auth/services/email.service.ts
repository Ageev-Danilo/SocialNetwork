import emailjs from '@emailjs/react-native';

const SERVICE_ID  = 'service_bwc7w3l';
const TEMPLATE_ID = 'template_nkzhzgh';
const PUBLIC_KEY  = 'oo2vhpTMpp57OA9Tn';


export async function sendVerificationEmail(
    toEmail: string,
    code: string,
): Promise<void> {
    await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        { to_email: toEmail, verification_code: code },
        { publicKey: PUBLIC_KEY },
    );
}