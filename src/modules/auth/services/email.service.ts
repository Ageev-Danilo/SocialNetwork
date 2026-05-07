import Constants from 'expo-constants';

const BASE_URL =
    Constants.expoConfig?.extra?.apiUrl ?? 'http://192.168.1.103:3000';

export async function sendVerificationEmail(toEmail: string): Promise<string> {
    const response = await fetch(`${BASE_URL}/mail/send-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: toEmail }),
    });

    if (!response.ok) {
        throw new Error('Не вдалося надіслати код');
    }

    const data = await response.json() as { code: string };
    return data.code; 
}