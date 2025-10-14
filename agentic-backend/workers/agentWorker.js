const OpenAI = require('openai');
const orchestrator = require('../orchestrator/orchestrator.js');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = async function agentWorker(node, { run, workflow }, input, orchestratorRef) {
  const prompt = node.params?.prompt || "Decide the next step based on context.";
  const context = { ...workflow.context, ...input };

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an intelligent orchestrator agent." },
        { role: "user", content: `${prompt}\n\nContext:\n${JSON.stringify(context, null, 2)}` }
      ],
      temperature: 0.4
    });

    const text = response.choices[0].message.content.trim();

    const match = text.match(/next:(\w+)/i);
    const decision = match ? match[1] : 'autoApprove';

    return {
      status: 'succeeded',
      output: { decision, reasoning: text },
      next: node.routes?.[decision] || node.next || []
    };

  } catch (err) {
    console.error('Agent Worker error:', err);
    return { status: 'failed', output: { error: err.message } };
  }
};
