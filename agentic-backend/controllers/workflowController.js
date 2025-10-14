const { Workflow } = require('../models');

module.exports = {
  // Create or update workflow version
  async saveWorkflow(req, res) {
    try {
      const { workflow_id, name, definition } = req.body;

      if (!workflow_id || !definition) {
        return res.status(400).json({ error: 'Workflow Error encountered.Please check again' });
      }

      // Increment version automatically
      const latest = await Workflow.findOne({ where: { workflow_id }, order: [['version', 'DESC']] });
      const newVersion = latest ? latest.version + 1 : 1;

      const record = await Workflow.create({
        workflow_id,
        name,
        version: newVersion,
        definition
      });

      return res.status(201).json({ message: 'Workflow saved', workflow: record });
    } catch (err) {
      console.error('saveWorkflow error:', err);
      res.status(500).json({ error: err.message });
    }
  },

  // Get latest workflow
  async getLatest(req, res) {
    try {
      const { workflow_id } = req.params;
      const wf = await Workflow.findOne({
        where: { workflow_id },
        order: [['version', 'DESC']]
      });
      if (!wf) return res.status(404).json({ error: 'Workflow not found' });
      res.json(wf);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // List all workflows
  async list(req, res) {
    try {
      const workflows = await Workflow.findAll({
        attributes: ['workflow_id', 'name', 'version', 'updatedAt']
      });
      res.json(workflows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
