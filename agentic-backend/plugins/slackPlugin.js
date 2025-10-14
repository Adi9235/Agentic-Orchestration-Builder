const axios = require('axios');

module.exports = {
  type: 'slack',
  label: 'Send Slack Message',
  description: 'Send a message to a Slack channel using Webhook.',

  async execute(params = {}, input = {}) {
    try {
      const webhookUrl = process.env.SLACK_WEBHOOK_URL;
      if (!webhookUrl) throw new Error('Slack connection broken');

      const text = params.text || input.text || 'Agentic Workflow Notification';

      await axios.post(webhookUrl, { text });

      console.log(`💬 Slack message sent: ${text}`);

      return {
        status: 'succeeded',
        output: { message: 'Slack message sent', text },
      };
    } catch (err) {
      console.error('Slack Plugin Error:', err.message);
      return {
        status: 'failed',
        output: { error: err.message },
      };
    }
  },
};
