import { Request, Response } from 'express';
import { sendVerificationEmail } from './email.service';
import { string } from 'yup';

export const mailController = {
    async sendEmail(req: Request, res: Response) {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ message: "Email обов'язковий" });
            }
            const code =  Math.floor(100000 + Math.random() * 900000).toString();


            await sendVerificationEmail(email, code);
            
            res.status(200).json({ message: "Лист відправлено!" });
        } catch (error: any) {
            console.error('EmailJS Error:', error);
            res.status(500).json({ 
                message: "Помилка відправки", 
                details: error.text || error.message 
            });
        }
    }
};