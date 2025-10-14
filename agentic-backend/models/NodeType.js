const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const NodeType = sequelize.define('NodeType', {
  type: { type: DataTypes.STRING, primaryKey: true },
  label: { type: DataTypes.STRING },
  icon: { type: DataTypes.STRING }
});

module.exports = NodeType;
