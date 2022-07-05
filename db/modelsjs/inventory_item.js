const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('inventory_item', {
    Inventory_item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Item_quantity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Item_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'resource',
        key: 'Item_id'
      }
    }
  }, {
    sequelize,
    tableName: 'inventory_item',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Inventory_item_id" },
        ]
      },
      {
        name: "Item_id",
        using: "BTREE",
        fields: [
          { name: "Item_id" },
        ]
      },
    ]
  });
};
