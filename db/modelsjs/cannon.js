const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cannon', {
    Cannon_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Cannon_name: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    Cost: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Damage: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Mass: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    Reload_time: {
      type: DataTypes.DECIMAL(7,2),
      allowNull: true
    },
    Ammo_speed: {
      type: DataTypes.DECIMAL(8,2),
      allowNull: true
    },
    Max_distance: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'cannon',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Cannon_id" },
        ]
      },
    ]
  });
};
