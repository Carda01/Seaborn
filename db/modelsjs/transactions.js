const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transactions', {
    Trans_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Money_amount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Experience_amount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    User_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'User_id'
      }
    },
    Npc_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'npc',
        key: 'Npc_id'
      }
    },
    Ship_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'type_of_ship',
        key: 'Ship_type_id'
      }
    },
    Harbor_shop_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'harbor_shop',
        key: 'Harbor_shop_id'
      }
    },
    Loot_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'loot',
        key: 'Loot_id'
      }
    }
  }, {
    sequelize,
    tableName: 'transactions',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Trans_id" },
        ]
      },
      {
        name: "User_id",
        using: "BTREE",
        fields: [
          { name: "User_id" },
        ]
      },
      {
        name: "Npc_id",
        using: "BTREE",
        fields: [
          { name: "Npc_id" },
        ]
      },
      {
        name: "Ship_type_id",
        using: "BTREE",
        fields: [
          { name: "Ship_type_id" },
        ]
      },
      {
        name: "Harbor_shop_id",
        using: "BTREE",
        fields: [
          { name: "Harbor_shop_id" },
        ]
      },
      {
        name: "Loot_id",
        using: "BTREE",
        fields: [
          { name: "Loot_id" },
        ]
      },
    ]
  });
};
