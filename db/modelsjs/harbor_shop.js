const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('harbor_shop', {
    Harbor_shop_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Discount: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    },
    Harbor_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'harbor',
        key: 'Harbor_id'
      }
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
    tableName: 'harbor_shop',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Harbor_shop_id" },
        ]
      },
      {
        name: "Harbor_id",
        using: "BTREE",
        fields: [
          { name: "Harbor_id" },
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
