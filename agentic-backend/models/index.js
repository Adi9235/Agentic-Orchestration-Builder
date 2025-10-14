const sequelize = require('../config/db');

const Workflow = require('./Workflow.js');
const Run = require('./Run.js');
const Node = require('./Node.js');
const NodeType = require('./NodeType.js');
const Event = require('./Event.js');


Workflow.hasMany(Node, { foreignKey: 'workflowId', sourceKey: 'workflow_id' });

module.exports = {
  sequelize,
  Workflow,
  Run,
  Node,
  NodeType,
  Event
};
