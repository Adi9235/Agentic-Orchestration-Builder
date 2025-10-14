const { v4: uuidv4 } = require('uuid');

function generateRunId() {
  return `run_${uuidv4()}`;
}

module.exports = { generateRunId };
