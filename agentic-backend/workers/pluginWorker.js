const plugins = require('../plugins');


module.exports = async function pluginWorker(node, { run }, input, orchestrator) {
  const { pluginType, ...params } = node.params || {};
  const plugin = plugins[pluginType];

  if (!plugin) {
    return { status: 'failed', output: { error: `Unknown plugin: ${pluginType}` } };
  }

  try {
    const result = await plugin.execute(params || {}, input);
    return {
      status: 'succeeded',
      output: result,
      next: node.next || []
    };
  } catch (err) {
    console.error('Plugin Worker error:', err.message);
    return { status: 'failed', output: { error: err.message } };
  }
};
