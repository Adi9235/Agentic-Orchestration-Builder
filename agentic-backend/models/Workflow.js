// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/db');

// const Workflow = sequelize.define('Workflow', {
//   id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
//   workflow_id: { type: DataTypes.STRING, allowNull: false }, 
//   version: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
//   name: { type: DataTypes.STRING },
//   definition: { type: DataTypes.JSONB, allowNull: false } 
// }, {
//   indexes: [{ unique: true, fields: ['workflow_id', 'version'] }]
// });

// module.exports = Workflow;


const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Workflow = sequelize.define('Workflow', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  workflow_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  version: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  name: { type: DataTypes.STRING },
  definition: { type: DataTypes.JSONB, allowNull: false }
}, {
  indexes: [
    { unique: true, fields: ['workflow_id', 'version'] } 
  ],
  tableName: 'Workflows'
});

module.exports = Workflow;
