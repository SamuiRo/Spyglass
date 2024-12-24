const sequelize = require('../sqlite/sqlite_db');
const { DataTypes, Sequelize } = require('sequelize')

const Steam_Item = sequelize.define("Steam_Item", {
    id:
    {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    app_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    appid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    market_hash_name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    sell_listings: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    sell_price: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true
    },
    detailes: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {}
    },
    median_sale_prices: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    lowest_price: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    buy_quantity: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    highest_buy_order: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
})

module.exports = Steam_Item