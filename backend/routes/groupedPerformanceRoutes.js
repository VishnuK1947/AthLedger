const express = require('express');
const router = express.Router();
const groupedPerformanceController = require('../controllers/groupedPerformanceController');

// Create grouped performances
router.post('/', async (req, res) => {
    try {
        const result = await groupedPerformanceController.createGroupedPerformance(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get grouped performances by transaction ID
router.get('/:transactionId', async (req, res) => {
    try {
        const result = await groupedPerformanceController.getGroupedPerformanceByTransactionId(
            req.params.transactionId
        );
        if (!result.success) {
            return res.status(404).json(result);
        }
        res.json(result);
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get grouped performances by data name
router.get('/data/:dataName', async (req, res) => {
    try {
        const result = await groupedPerformanceController.getGroupedPerformancesByDataName(
            req.params.dataName
        );
        res.json(result);
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Add performance to group
router.post('/:transactionId/performances', async (req, res) => {
    try {
        const result = await groupedPerformanceController.addPerformance(
            req.params.transactionId,
            req.body.performanceId
        );
        if (!result.success) {
            return res.status(404).json(result);
        }
        res.json(result);
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Remove performance from group
router.delete('/:transactionId/performances/:performanceId', async (req, res) => {
    try {
        const result = await groupedPerformanceController.removePerformance(
            req.params.transactionId,
            req.params.performanceId
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