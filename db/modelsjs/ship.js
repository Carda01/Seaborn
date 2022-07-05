const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ship', {
    Ship_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Ship_name: {
      type: DataTypes.STRING(30),
      allowNull: true,
      defaultValue: "Unnamed"
    },
    Chosen_skin: {
      type: DataTypes.STRING(30),
      allowNull: true,
      defaultValue: "None"
    },
    HP_upgrades: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0
    },
    Crew_upgrades: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0
    },
    Cargo_upgrades: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0
    },
    Speed_upgrades: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0
    },
    Cannon_upgrades: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0
    },
    Equiped_cannons: {
      type: DataTypes.STRING(30),
      allowNull: true,
      defaultValue: "Default"
    },
    Current_HP: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1000
    },
    Ship_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'type_of_ship',
        key: 'Ship_type_id'
      }
    },
    User_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'User_id'
      }
    },
    Cannon_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'cannon',
        key: 'Cannon_id'
      }
    },
    Inventory_item_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'inventory_item',
        key: 'Inventory_item_id'
      }
    },
    x:{
      type: DataTypes.INTEGER,
      allowNull:false,
    },
    y:{
      type: DataTypes.INTEGER,
      allowNull:true,
    }
  }, {
    sequelize,
    tableName: 'ship',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Ship_id" },
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
        name: "User_id",
        using: "BTREE",
        fields: [
          { name: "User_id" },
        ]
      },
      {
        name: "Cannon_id",
        using: "BTREE",
        fields: [
          { name: "Cannon_id" },
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
