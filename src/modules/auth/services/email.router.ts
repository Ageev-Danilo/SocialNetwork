import { Router } from 'express';
import { mailController } from './email.controller';

export const mailRouter = Router();

mailRouter.post('/send', mailController.sendEmail);