const express = require('express');
const router = express.Router();
const approvalController = require('../controllers/approvalController');

router.post('/:run_id/:node_id/approve', approvalController.approveNode);

module.exports = router;
