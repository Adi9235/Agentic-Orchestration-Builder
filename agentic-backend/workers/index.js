// workers/index.js
const agentWorker = require('./agentWorker');
const httpWorker = require('./httpWorker');
const humanWorker = require('./humanWorker');
const pluginWorker = require('./pluginWorker');

module.exports = {
  agent: agentWorker,
  http: httpWorker,
  human: humanWorker,
  plugin: pluginWorker
};
