require('dotenv').config();
const OpenAI = require('openai');
const { v4: uuidv4 } = require('uuid');
const eventBus = require('./eventBus');
const { Event, Run, Workflow } = require('../models');
const workers = require('../workers');
const stateManager = require('./stateManager');

class Orchestrator {
  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async emitEventPersist(run_id, node_id, type, payload = {}, meta = {}) {
    await Event.create({ run_id, node_id, type, payload, meta });
    await eventBus.emitEvent(type, { run_id, node_id, payload, meta });
  }

  //  Start a workflow run
  async startRun(workflowRecord, input = {}) {
    const run_id = `run_${uuidv4()}`;
    const run = await Run.create({
      run_id,
      workflow_id: workflowRecord.workflow_id,
      workflow_version: workflowRecord.version,
      input,
      status: 'running'
    });

    await this.emitEventPersist(run_id, null, 'workflow.run.started', { input });

    const def = workflowRecord.definition;
    const startNode =
      def.startNode ||
      (def.nodes && def.nodes[0] && def.nodes[0].id);

    if (!startNode) {
      await this.emitEventPersist(run_id, null, 'workflow.failed', { reason: 'no start node' });
      await run.update({ status: 'failed' });
      return run;
    }

    // Kick off execution
    await eventBus.emitEvent('executeNode', {
      run_id,
      workflow_id: workflowRecord.workflow_id,
      workflow_version: workflowRecord.version,
      node_id: startNode,
      input
    });
    return run;
  }

  //  Execute a specific node
  async executeNode({ run_id, workflow_id, workflow_version, node_id, input = {} }) {
    const run = await Run.findOne({ where: { run_id } });
    const wf = await Workflow.findOne({ where: { workflow_id, version: workflow_version } });
    if (!run || !wf) {
      console.error('Run or workflow not found:', run_id);
      return;
    }

    const def = wf.definition;
    const node = (def.nodes || []).find((n) => n.id === node_id);
    if (!node) {
      await this.emitEventPersist(run_id, node_id, 'node.failed', { error: 'node not found' });
      return;
    }

    await this.emitEventPersist(run_id, node.id, 'node.started', { input });

    const worker = workers[node.type];
    if (!worker) {
      await this.emitEventPersist(run_id, node.id, 'node.failed', { error: `no worker for ${node.type}` });
      return;
    }

    let result;
    try {
      result = await worker(node, { run, workflow: def }, input, this);
      await stateManager.saveState(run_id, { lastNode: node_id, output: result?.output });
    } catch (err) {
      console.error('Worker error:', err);
      await this.emitEventPersist(run_id, node.id, 'node.failed', { error: err.message });
      await run.update({ status: 'failed' });
      return;
    }

    if (!result) result = { status: 'succeeded', output: null, next: node.next || [] };

    if (result.status === 'paused') {
      await this.emitEventPersist(run_id, node.id, 'node.paused', { output: result.output });
      await run.update({ status: 'paused' });
      return;
    }

    await this.emitEventPersist(run_id, node.id, 'node.completed', { output: result.output });

    const nexts = result.next || node.next || [];
    if (!nexts || nexts.length === 0) {
      await this.emitEventPersist(run_id, null, 'workflow.completed', { message: 'done' });
      await run.update({ status: 'completed' });
      return;
    }

    for (const nid of nexts) {
      await eventBus.emitEvent('executeNode', {
        run_id,
        workflow_id: wf.workflow_id,
        workflow_version: wf.version,
        node_id: nid,
        input: result.output
      });
    }
  }

  //  Resume paused workflow after human approval
  async resumeAfterApproval(run_id, node_id, approvalPayload) {
    await this.emitEventPersist(run_id, node_id, 'workflow.human.approved', approvalPayload);
    await Run.update({ status: 'running' }, { where: { run_id } });

    const run = await Run.findOne({ where: { run_id } });
    const wf = await Workflow.findOne({ where: { workflow_id: run.workflow_id, version: run.workflow_version } });
    const node = (wf.definition.nodes || []).find((n) => n.id === node_id);

    const nexts = (node && node.next) || [];
    for (const nid of nexts) {
      await eventBus.emitEvent('executeNode', {
        run_id,
        workflow_id: wf.workflow_id,
        workflow_version: wf.version,
        node_id: nid,
        input: approvalPayload
      });
    }
  }

  // Agentic reasoning with OpenAI
  async callAgent({ prompt, context }) {
    try {
      const input = `
You are an intelligent workflow agent. 
Task: ${prompt}
Context: ${JSON.stringify(context, null, 2)}
Respond in JSON only, e.g. { "decision": "...", "reason": "..." }`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: input }]
      });

      const text = response.choices[0].message.content;
      console.log(' Agent decision:', text);

      // Try parsing the JSON decision
      try {
        return JSON.parse(text);
      } catch {
        return { decision: text };
      }
    } catch (err) {
      console.error('Agent call failed:', err);
      return { decision: 'fallback', error: err.message };
    }
  }
}

module.exports = new Orchestrator();
