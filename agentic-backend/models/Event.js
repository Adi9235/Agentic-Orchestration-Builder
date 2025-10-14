const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Event = sequelize.define('Event', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  run_id: { type: DataTypes.STRING, allowNull: false },
  node_id: { type: DataTypes.STRING, allowNull: true },
  type: { type: DataTypes.STRING, allowNull: false },
  payload: { type: DataTypes.JSONB, allowNull: true },
  meta: { type: DataTypes.JSONB, allowNull: true }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Event;
