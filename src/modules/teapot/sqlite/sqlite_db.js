const { Sequelize } = require("sequelize")

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: "./pot.sqlite",
    logging: false
});

module.exports = sequelize