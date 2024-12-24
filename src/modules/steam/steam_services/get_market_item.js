const browser = require("../../browser/browser.module")
const { notify } = require("../../notification/notication")

const xx = "https://steamcommunity.com/market/listings/730/Fracture%20Case"

async function get_market_item(item_url) {
    try {
        const context = await browser.init("Spyglass", false)

        const page = await context.newPage()

        await page.goto(item_url, { waitUntil: "networkidle" })

        await _gather_item_data(page)
    } catch (error) {
        console.log(error)
        notify(error.message)
    }
}

async function _gather_item_data(page) {
    let data = {}
    try {
        const content = await page.content();
        const line1Match = content.match(/var line1=([^;]+);/);

        if (line1Match) {
            // console.log(line1Match[1])
            // JSON.parse(match[1]);
            const line1 = JSON.parse(`${line1Match[1]}`)
                ;
            console.log(line1[0]);

            data.median_sales_prices = line1
        }

        return data
    } catch (error) {
        console.log(error)
        notify(error.message)
    } finally {
    }
}

module.exports = {
    get_market_item
}