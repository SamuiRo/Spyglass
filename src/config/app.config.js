require("dotenv").config()

module.exports = {
    AZURE_ENDPOINT: process.env.AZURE_ENDPOINT,
    AZURE_KEY: process.env.AZURE_KEY,
    AZURE_DB_ID: process.env.AZURE_DB_ID,
    STEAM_LOGIN: process.env.STEAM_LOGIN,
    STEAM_PASS: process.env.STEAM_PASS,
    TOTP: process.env.TOTP,
    USERAGENT: process.env.USERAGENT,
    VIEWPORT_WIDTH: 1280,
    VIEWPORT_HEIGHT: 880,
    HEADLESS: false,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHANNEL_ID: process.env.TELEGRAM_CHANNEL_ID,
    TELEGRAM_FORUM_ID: process.env.TELEGRAM_FORUM_ID,
    SCOUT_GAME_TARGET: process.env.SCOUT_GAME_TARGET,
}