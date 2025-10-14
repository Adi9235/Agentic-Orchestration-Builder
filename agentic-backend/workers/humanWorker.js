
module.exports = async function humanWorker(node, { run }, input, orchestrator) {
  console.log(`Pausing workflow ${run.run_id} for human review...`);
  return {
    status: 'paused',
    output: {
      message: node.params?.message || 'Awaiting human approval',
      input
    }
  };
};
