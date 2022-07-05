const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('npc', {
    Npc_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Npc_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Type: {
      type: DataTypes.STRING(30),
      allowNull: true,
      defaultValue: "Default"
    },
    Fraction: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "Unknown"
    },
    Damage: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    HP: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Speed: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    },
    Money: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Experience: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Inventory_item_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'inventory_item',
        key: 'Inventory_item_id'
      }
    }
  }, {
    sequelize,
    tableName: 'npc',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Npc_id" },
        ]
      },
      {
        name: "Inventory_item_id",
        using: "BTREE",
        fields: [
          { name: "Inventory_item_id" },
        ]
      },
    ]
  });
};
