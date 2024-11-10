// const express = require('express');
// const router = express.Router();
// const performanceController = require('../controllers/performanceController');

// // Create performance
// router.post('/', async (req, res) => {
//     try {
//         const result = await performanceController.createPerformance(req.body);
//         res.status(201).json(result);
//     } catch (error) {
//         res.status(400).json({ success: false, error: error.message });
//     }
// });

// // Get performance by ID
// router.get('/:performanceId', async (req, res) => {
//     try {
//         const result = await performanceController.getPerformanceById(req.params.performanceId);
//         if (!result.success) {
//             return res.status(404).json(result);
//         }
//         res.json(result);
//     } catch (error) {
//         res.status(400).json({ success: false, error: error.message });
//     }
// });

// // Get performances by athlete
// router.get('/athlete/:athleteUuid', async (req, res) => {
//     try {
//         const result = await performanceController.getPerformancesByAthlete(req.params.athleteUuid);
//         res.json(result);
//     } catch (error) {
//         res.status(400).json({ success: false, error: error.message });
//     }
// });

// // Get public performances by athlete
// router.get('/athlete/:athleteUuid/public', async (req, res) => {
//     try {
//         const result = await performanceController.getPublicPerformancesByAthlete(req.params.athleteUuid);
//         res.json(result);
//     } catch (error) {
//         res.status(400).json({ success: false, error: error.message });
//     }
// });

// module.exports = router;

import express, { Router } from 'express';
import { PerformanceController, authMiddleware } from '../controllers/performanceController';

const router: Router = express.Router();

// Create performance from CSV
router.post(
  '/upload',
  authMiddleware,
  PerformanceController.createPerformance
);

// Create standard performance (keeping existing functionality)
router.post(
  '/',
  authMiddleware,
  async (req, res) => {
    try {
      const result = await PerformanceController.createPerformance(req.body);
      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }
);

// Get performance by ID
router.get(
  '/:performanceId',
  authMiddleware,
  async (req, res) => {
    try {
      const result = await PerformanceController.getPerformanceById(req);
      res.json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }
);

// Get performances by athlete
router.get(
  '/athlete/:athleteUuid',
  authMiddleware,
  async (req, res) => {
    try {
      const result = await PerformanceController.getPerformancesByAthlete(req);
      res.json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }
);

// Get public performances by athlete
router.get(
  '/athlete/:athleteUuid/public',
  authMiddleware,
  async (req, res) => {
    try {
      const result = await PerformanceController.getPublicPerformancesByAthlete(req);
      res.json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }
);

// Update performance
router.put(
  '/:performanceId',
  authMiddleware,
  async (req, res) => {
    try {
      const result = await PerformanceController.updatePerformance(req);
      res.json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }
);

// Delete performance
router.delete(
  '/:performanceId',
  authMiddleware,
  async (req, res) => {
    try {
      const result = await PerformanceController.deletePerformance(req);
      res.json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }
);

// Toggle performance privacy
router.patch(
  '/:performanceId/toggle-privacy',
  authMiddleware,
  async (req, res) => {
    try {
      const result = await PerformanceController.togglePrivacy(req);
      res.json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }
);

export default router;