const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('login_history', {
    Login_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Login_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Logout_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    User_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'User_id'
      }
    }
  }, {
    sequelize,
    tableName: 'login_history',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Login_id" },
        ]
      },
      {
        name: "User_id",
        using: "BTREE",
        fields: [
          { name: "User_id" },
        ]
      },
    ]
  });
};
