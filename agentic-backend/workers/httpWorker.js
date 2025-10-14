const axios = require('axios');

module.exports = async function httpWorker(node, { run }, input, orchestrator) {
  const { method = 'GET', url, headers = {}, body = {} } = node.params || {};

  try {
    const response = await axios({
      method,
      url,
      headers,
      data: body,
      validateStatus: () => true
    });

    return {
      status: 'succeeded',
      output: { status: response.status, data: response.data },
      next: node.next || []
    };
  } catch (err) {
    console.error('HTTP Worker error:', err.message);
    return { status: 'failed', output: { error: err.message } };
  }
};
