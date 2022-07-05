const {Sequelize} = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false
})

try {
    sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}



let initModels = require("./modelsjs/init-models");
let models = initModels(sequelize);

module.exports=models;