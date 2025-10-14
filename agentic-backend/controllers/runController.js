const { Workflow, Run } = require('../models');
const orchestrator = require('../orchestrator/orchestrator.js');

module.exports = {
  // Start a workflow
  async startRun(req, res) {
    try {
      const { workflow_id, input } = req.body;

      const wf = await Workflow.findOne({
        where: { workflow_id },
        order: [['version', 'DESC']]
      });

      if (!wf) return res.status(404).json({ error: 'Workflow not found' });

      const run = await orchestrator.startRun(wf, input || {});
      res.status(200).json({ message: 'Run started', run_id: run.run_id });
    } catch (err) {
      console.error('startRun error:', err);
      res.status(500).json({ error: err.message });
    }
  },

  // List all runs
  async listRuns(req, res) {
    try {
      const runs = await Run.findAll({
        attributes: ['run_id', 'workflow_id', 'status', 'createdAt', 'updatedAt']
      });
      res.json(runs);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get details of a single run
  async getRun(req, res) {
    try {
      const { run_id } = req.params;
      const run = await Run.findOne({ where: { run_id } });
      if (!run) return res.status(404).json({ error: 'Run not found' });
      res.json(run);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async replayRun(req, res) {
    try {
      const { run_id } = req.params;

      const oldRun = await Run.findOne({ where: { run_id } });
      if (!oldRun) return res.status(404).json({ error: 'Original run not found' });

      const workflow = await Workflow.findOne({
        where: { workflow_id: oldRun.workflow_id, version: oldRun.workflow_version }
      });

      if (!workflow) return res.status(404).json({ error: 'Workflow not found for replay' });

      const replayInput = req.body?.input || oldRun.input || {};

      const newRun = await orchestrator.startRun(workflow, replayInput);

      res.json({
        message: 'Replay started successfully',
        original_run: run_id,
        new_run_id: newRun.run_id,
        workflow_id: workflow.workflow_id,
        version: workflow.version
      });
    } catch (err) {
      console.error('replayRun error:', err);
      res.status(500).json({ error: err.message });
    }
  }
  
};
