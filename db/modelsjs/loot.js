const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('loot', {
    Loot_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Type: {
      type: DataTypes.STRING(30),
      allowNull: true,
      defaultValue: "Default"
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
    tableName: 'loot',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Loot_id" },
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
