
import { Request, Response } from 'express';
import { WebhookEvent } from '@clerk/backend';
import { userController } from './userController';
import { v4 as uuidv4 } from 'uuid';

class WebhookController {
  async handleClerkWebhook(req: Request, res: Response) {
    const evt = req.body as WebhookEvent;

    try {
      switch (evt.type) {
        case 'user.created': {
          const { id, email_addresses, username, created_at } = evt.data;
          const primaryEmail = email_addresses[0]?.email_address;
          
          if (!primaryEmail) {
            throw new Error('No email address found for user');
          }

          await userController.createUser({
            uuid: uuidv4(), // Generate a new UUID for the user
            email: primaryEmail,
            username: username || `user_${id.slice(0, 8)}`,
            walletId: `wallet_${id}`, // You might want to generate this differently
            isAthlete: false, // Default value, can be updated later
            revenueEarned: 0
          });
          break;
        }

        case 'user.updated': {
          const { id, email_addresses, username } = evt.data;
          const primaryEmail = email_addresses[0]?.email_address;

          if (!primaryEmail) {
            throw new Error('No email address found for user');
          }

          const existingUser = await userController.getUserByEmail(primaryEmail);
          
          if (existingUser) {
            await userController.updateUser(existingUser.uuid, {
              email: primaryEmail,
              username: username || existingUser.username
            });
          }
          break;
        }

        case 'user.deleted': {
          const { id, email_addresses } = evt.data;
          const primaryEmail = email_addresses[0]?.email_address;

          if (primaryEmail) {
            const user = await userController.getUserByEmail(primaryEmail);
            if (user) {
              await userController.deleteUser(user.uuid);
            }
          }
          break;
        }
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Error handling webhook:', error);
      res.status(500).json({ error: 'Error processing webhook' });
    }
  }
}

export const webhookController = new WebhookController();
