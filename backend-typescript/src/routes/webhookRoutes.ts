import express from 'express';
import { verifyClerkWebhook } from '../middleware/clerkWebhookMiddleware';
import { webhookController } from '../controllers/webhookController';

const router = express.Router();

router.post('/clerk',
  verifyClerkWebhook,
  webhookController.handleClerkWebhook
);

export default router;