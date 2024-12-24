const axios = require("axios")
const fs = require("fs")

const { notify } = require("../notification/notication")
const Steam = require("../steam/steam")
const { sleep } = require("../../shared/utilis")
const { get_steam_item_without_median_sale_prices, get_steam_items_without_median_sale_prices, upsert_steam_item } = require("../teapot/cosmos/steamitem_service/index")
const { CS2, TEAMFORTRESS2 } = require("../../config/appids")
const { UAH } = require("../../config/currency")
const { SCOUT_TARGET} = require("../../config/app.config")



const item_list = []

const APP_ID = TEAMFORTRESS2

async function scout() {
    try {
        const {
            steam_client,
            steam_community,
            steam_manager
        } = await Steam.init(null)

        const items = await get_steam_items_without_median_sale_prices(CS2)

        console.log(items)

        for (let item of items) {
            try {
                let import_obj
                // const item = await get_steam_item_without_median_sale_prices(CS2)

                const steam_item = await Steam.getItemInfo(steam_community, item.appid, item.market_hash_name, UAH)


                if (!steam_item) {
                    await notify(`Steam item data is missing for ${item.market_hash_name}`)
                    throw new Error(`Steam item data is missing for ${item.market_hash_name}`);
                }

                import_obj = {
                    ...item,
                    median_sale_prices: steam_item.medianSalePrices || [],
                    quantity: steam_item.quantity || null,
                    lowest_price: steam_item.lowestPrice || null,
                    buy_quantity: steam_item.buyQuantity || null,
                    highest_buy_order: steam_item.highestBuyOrder || null,
                    detailes: {
                        ...item.detailes,
                        icon_url_large: steam_item?.firstAsset?.icon_url_large || null
                    }
                }

                console.log(import_obj)

                await upsert_steam_item(import_obj)

                // fs.writeFileSync("test.json", JSON.stringify(steam_item))
                // fs.writeFileSync("test11.json", JSON.stringify(item))

                await sleep(10000)
            } catch (error) {
                notify("ERROR | WHILE SCOUT: " + error.message)
            }
        }
        // while (true) {

        // }


    } catch (error) {
        console.log(error)
    }
}

async function title_scout(params) {
    let start = 0;
    let allItems = [];
    const count = 100;
    // await get_steam_market_titles_by_game(0, 100, 252490)
    try {
        while (true) {
            const items = await get_steam_market_titles_by_game(start, count, APP_ID)

            await load_to_cosmos(items, APP_ID)

            if (items.length < count) {
                break; // Виходимо з циклу, якщо отримали менше, ніж запитаний count
            }
            await sleep(10000)

            start += count;
        }

        console.log(`Загальна кількість завантажених елементів: ${allItems.length}`);
        return allItems;
    } catch (error) {
        console.error("Помилка під час завантаження даних:", error);
    }
}

async function get_steam_market_titles_by_game(start, count, appid) {
    try {
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://steamcommunity.com/market/search/render/?query=&start=${start}&count=${count}&search_descriptions=0&sort_column=name&sort_dir=asc&appid=${appid}&norender=1`,
        };

        // Виконання запиту
        const response = await axios.request(config);

        // Додаємо нові елементи до загального масиву
        const items = response.data.results;

        console.log(`Завантажено ${items.length} елементів, початок: ${start}`);

        return items
    } catch (error) {
        console.log(error)
    }
}

async function load_to_cosmos(items, appid) {
    try {
        for (let item of items) {

            const import_obj = {
                app_name: item.app_name,
                appid,
                market_hash_name: item.hash_name,
                sell_listings: item.sell_listings,
                sell_price: item.sell_price,
                type: item.asset_description.type,
                detailes: {
                    ...item.asset_description,
                    sell_price_text: item.sell_price_text,
                    sale_price_text: item.sale_price_text
                }
            }
            await upsert_steam_item(import_obj)
        }

        console.log("Steam Items upsert complete")

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    scout,
    title_scout
}