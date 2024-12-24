const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const { VIEWPORT_WIDTH, VIEWPORT_HEIGHT, USERAGENT, } = require("../../config/app.config")

async function init(profile, headless = true) {
    try {
        const sessionFolderPath = path.join(process.cwd(), "browser_sessions", profile, 'session');

        if (!fs.existsSync(sessionFolderPath)) fs.mkdirSync(sessionFolderPath, { recursive: true });

        // const pathToExtension = require('path').join(__dirname, "extensions");

        const context = await chromium.launchPersistentContext(sessionFolderPath, {
            headless: headless,
            args: [
                '--disable-blink-features=AutomationControlled',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-infobars',
                '--disable-extensions',
                '--disable-dev-shm-usage',
                // `--disable-extensions-except=${pathToExtension}`,
                // `--load-extension=${pathToExtension}`
            ],
            userAgent: USERAGENT,
            viewport: { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT },
        });

        console.log("Created context for", profile)
        return context
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    init
}