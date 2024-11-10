const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');

// Create user
router.post('/', async (req, res) => {
    try {
        const result = await userController.createUser(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get user by UUID
router.get('/:uuid', async (req, res) => {
    try {
        const result = await userController.getUserByUuid(req.params.uuid);
        if (!result.success) {
            return res.status(404).json(result);
        }
        res.json(result);
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get all athletes
router.get('/athletes', async (req, res) => {
    try {
        const result = await userController.getAthletes();
        res.json(result);
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

module.exports = router;