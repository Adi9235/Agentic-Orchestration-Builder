const express = require('express');
const router = express.Router();
const runController = require('../controllers/runController');

router.post('/', runController.startRun);
router.get('/', runController.listRuns);
router.get('/:run_id', runController.getRun);
router.post('/replay/:run_id', runController.replayRun);

module.exports = router;
