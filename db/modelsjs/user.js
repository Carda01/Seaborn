const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define('user', {
        User_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        Username: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        Register_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        Encrypted_password: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        Email: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: "Email_UNIQUE"
        },
        Bio: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        Experience: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        Pocket_money: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        Confirmation_code: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        resetToken: {
            type: DataTypes.STRING(45),
            allowNull: true
        },
        resetTokenExp: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        sequelize,
        tableName: 'user',
        timestamps: false,
        indexes: [
            {
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [
                    {name: "User_id"},
                ]
            },
            {
                name: "Email_UNIQUE",
                unique: true,
                using: "BTREE",
                fields: [
                    {name: "Email"},
                ]
            },
        ]
    });

    User.addHook('beforeCreate', async (user, options) => {
        const hashedPw = await bcrypt.hash(user.Encrypted_password, 10);
        user.Encrypted_password = hashedPw;
    });

    User.addHook('beforeUpdate', async (user, options) => {
        const hashedPw = await bcrypt.hash(user.Encrypted_password, 10);
        user.Encrypted_password = hashedPw;
    });

    User.prototype.isValidPassword = async function (password){
        const compare = await bcrypt.compare(password, this.Encrypted_password);
        return compare;
    }

    return User;

};
