const express = require('express');
const router = express.Router();
const workflowController = require('../controllers/workflowController.js');

router.post('/', workflowController.saveWorkflow);
router.get('/', workflowController.list);
router.get('/:workflow_id', workflowController.getLatest);

module.exports = router;
