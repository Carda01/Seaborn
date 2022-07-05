const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('islands', {
    Island_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Island_name: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    Position_x: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Position_y: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Owner_fraction: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "Unknown"
    }
  }, {
    sequelize,
    tableName: 'islands',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Island_id" },
        ]
      },
    ]
  });
};
