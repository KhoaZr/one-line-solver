const express = require('express');
const solverController = require('../controllers/solverController');

const router = express.Router();

// POST /api/send-result
router.post('/send-result', solverController.solvePuzzle);

module.exports = router;
