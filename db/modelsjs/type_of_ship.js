const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('type_of_ship', {
    Ship_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Ship_type_name: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    Rank_exp: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Cost: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Base_HP: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Base_cannon_slots: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Base_speed: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    },
    Base_crew_slots: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Base_cargo: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    Maximum_upgrades: {
      type: DataTypes.TINYINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'type_of_ship',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Ship_type_id" },
        ]
      },
    ]
  });
};
