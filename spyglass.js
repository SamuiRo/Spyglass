const Steam_services = require("./src/modules/steam/steam_services/index")
const Steam = require("./src/modules/steam/steam")
const { notify } = require("./src/modules/notification/notication")
const sequelize = require("./src/modules/teapot/sqlite/sqlite_db")
const { title_scout, scout } = require("./src/modules/scout/scout")

async function main() {
    try {
        await _connectDB()

        // await title_scout(null)
        await scout()
    } catch (error) {
        console.log(error)
        notify(error.message)
    }
}

async function _connectDB() {
    try {
        await sequelize.authenticate()
        await sequelize.sync()

        console.log("Connected")
    } catch (error) {
        console.log(error)
    }
}

main()