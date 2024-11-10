const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Create transaction
router.post('/', async (req, res) => {
    try {
        const result = await transactionController.createTransaction(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get transaction by ID
router.get('/:transactionId', async (req, res) => {
    try {
        const result = await transactionController.getTransactionById(req.params.transactionId);
        if (!result.success) {
            return res.status(404).json(result);
        }
        res.json(result);
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get transactions by user (either as sender or client)
router.get('/user/:userUuid', async (req, res) => {
    try {
        const result = await transactionController.getTransactionsByUser(req.params.userUuid);
        res.json(result);
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update transaction status
router.put('/:transactionId/status', async (req, res) => {
    try {
        const result = await transactionController.updateTransactionStatus(
            req.params.transactionId, 
            req.body.status
        );
        if (!result.success) {
            return res.status(404).json(result);
        }
        res.json(result);
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

module.exports = router;