// controllers/approvalController.js
const orchestrator = require('../orchestrator/orchestrator.js');
const { Run } = require('../models');

module.exports = {
  // Approve a paused node
  async approveNode(req, res) {
    try {
      const { run_id, node_id } = req.params;
      const approvalPayload = req.body || {};

      const run = await Run.findOne({ where: { run_id } });
      if (!run) return res.status(404).json({ error: 'Run not found' });

      if (run.status !== 'paused') {
        return res.status(400).json({ error: 'Run is not paused or awaiting approval.' });
      }

      await orchestrator.resumeAfterApproval(run_id, node_id, approvalPayload);
      res.json({ message: 'Workflow resumed after approval.' });
    } catch (err) {
      console.error('approveNode error:', err);
      res.status(500).json({ error: err.message });
    }
  }
};
