const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('resource', {
    Item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Item_name: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    Cost: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Mass: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    Tier: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'resource',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Item_id" },
        ]
      },
    ]
  });
};
