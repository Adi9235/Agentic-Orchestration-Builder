require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const { sequelize } = require('./models');
const eventBus = require('./orchestrator/eventBus.js');
const orchestrator = require('./orchestrator/orchestrator.js');

const workflowRoutes = require('./routes/workflowRoutes.js');
const runRoutes = require('./routes/runRoutes.js');
const approvalRoutes = require('./routes/approvalRoutes.js');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Agentic Orchestration Backend is running.');
});

app.use('/api/workflows', workflowRoutes);
app.use('/api/runs', runRoutes);
app.use('/api/approvals', approvalRoutes);

eventBus.on('executeNode', async (data) => {
  try {
    await orchestrator.executeNode(data);
  } catch (err) {
    console.error('ExecuteNode event failed:', err.message);
  }
});

eventBus.on('workflow.completed', (data) => {
  console.log(`Workflow completed: ${data.run_id}`);
});

eventBus.on('workflow.failed', (data) => {
  console.error(`Workflow failed: ${data.run_id}`, data);
});

eventBus.on('node.paused', (data) => {
  console.log(`Workflow paused (awaiting human approval): ${data.run_id}`);
});

eventBus.on('node.completed', (data) => {
  console.log(`Node completed: ${data.node_id} (Run: ${data.run_id})`);
});

async function startServer() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('Connected to Postgres.');

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
}

startServer();
