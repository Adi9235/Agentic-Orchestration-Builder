// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/db');
// const Workflow = require('./Workflow'); 

// const Node = sequelize.define('Node', {
//   id: { 
//     type: DataTypes.STRING, 
//     primaryKey: true 
//   },
//   workflowId: { 
//     type: DataTypes.STRING,
//     allowNull: false,
//     references: {
//       model: Workflow,     
//       key: 'workflow_id'
//     },
//     onDelete: 'CASCADE',   
//     onUpdate: 'CASCADE'
//   },
//   type: { type: DataTypes.STRING },
//   name: { type: DataTypes.STRING },
//   config: { type: DataTypes.JSONB },
//   next: { type: DataTypes.ARRAY(DataTypes.STRING) }
// });

// module.exports = Node;


const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Workflow = require('./Workflow');

const Node = sequelize.define('Node', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  workflowId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Workflow,
      key: 'id' 
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  type: { type: DataTypes.STRING },
  name: { type: DataTypes.STRING },
  config: { type: DataTypes.JSONB },
  next: { type: DataTypes.ARRAY(DataTypes.STRING) }
}, {
  tableName: 'Nodes'
});

module.exports = Node;
