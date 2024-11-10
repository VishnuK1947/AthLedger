import { Request, Response, NextFunction } from 'express';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/backend';

const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

export const verifyClerkWebhook = (req: Request, res: Response, next: NextFunction) => {
  if (!CLERK_WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET is not defined');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  try {
    const svixHeaders = {
      'svix-id': req.headers['svix-id'] as string,
      'svix-timestamp': req.headers['svix-timestamp'] as string,
      'svix-signature': req.headers['svix-signature'] as string,
    };

    // Ensure all required headers are present
    if (!svixHeaders['svix-id'] || !svixHeaders['svix-timestamp'] || !svixHeaders['svix-signature']) {
      return res.status(400).json({ error: 'Missing required Svix headers' });
    }

    const wh = new Webhook(CLERK_WEBHOOK_SECRET);
    
    // If body is already parsed, stringify it back
    const payloadString = typeof req.body === 'string' 
      ? req.body 
      : JSON.stringify(req.body);

    wh.verify(payloadString, svixHeaders);
    next();
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return res.status(400).json({ error: 'Webhook verification failed' });
  }
};