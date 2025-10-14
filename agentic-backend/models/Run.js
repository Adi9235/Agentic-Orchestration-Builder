const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Run = sequelize.define('Run', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  run_id: { type: DataTypes.STRING, allowNull: false, unique: true },
  workflow_id: { type: DataTypes.STRING, allowNull: false },
  workflow_version: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'running' },
  input: { type: DataTypes.JSONB },
  state: { type: DataTypes.JSONB }
}, {
  indexes: [{ fields: ['run_id'] }]
});

module.exports = Run;
