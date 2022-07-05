const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('harbor', {
    Harbor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Harbor_size: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    Ship_repairing: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 1
    },
    Ship_shopping: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 1
    },
    PVP_status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    Island_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'islands',
        key: 'Island_id'
      }
    }
  }, {
    sequelize,
    tableName: 'harbor',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Harbor_id" },
        ]
      },
      {
        name: "Island_id",
        using: "BTREE",
        fields: [
          { name: "Island_id" },
        ]
      },
    ]
  });
};
