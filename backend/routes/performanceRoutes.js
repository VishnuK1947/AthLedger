const express = require('express');
const router = express.Router();
const performanceController = require('../controllers/performanceController');

// Create performance
router.post('/', async (req, res) => {
    try {
        const result = await performanceController.createPerformance(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get performance by ID
router.get('/:performanceId', async (req, res) => {
    try {
        const result = await performanceController.getPerformanceById(req.params.performanceId);
        if (!result.success) {
            return res.status(404).json(result);
        }
        res.json(result);
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get performances by athlete
router.get('/athlete/:athleteUuid', async (req, res) => {
    try {
        const result = await performanceController.getPerformancesByAthlete(req.params.athleteUuid);
        res.json(result);
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get public performances by athlete
router.get('/athlete/:athleteUuid/public', async (req, res) => {
    try {
        const result = await performanceController.getPublicPerformancesByAthlete(req.params.athleteUuid);
        res.json(result);
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

module.exports = router;