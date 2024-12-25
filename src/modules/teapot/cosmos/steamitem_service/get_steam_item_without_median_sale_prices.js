const { client, database_id } = require("../cosmos.client")

const container_id = "Steam_Item";

async function get_steam_item_without_median_sale_prices(appid) {
    const container = client.database(database_id).container(container_id);

    try {
        // Запит для отримання одного запису без поля "median_sale_prices" із фільтром за appid
        const querySpec = {
            query: `
                SELECT TOP 1 * 
                FROM c 
                WHERE NOT IS_DEFINED(c.median_sale_prices) 
                ${appid ? "AND c.appid = @appid" : ""}
            `,
            parameters: appid ? [{ name: "@appid", value: appid }] : []
        };

        const { resources: items } = await container.items.query(querySpec).fetchAll();

        if (items.length > 0) {
            console.log("Item without 'median_sale_prices' retrieved successfully:");
            return items[0]; // Повертаємо перший запис
        } else {
            console.log("No item found without 'median_sale_prices'.");
            return null;
        }
    } catch (error) {
        console.error("Error retrieving item without 'median_sale_prices':", error);
        throw error;
    }
}

// async function get_steam_items_without_median_sale_prices(appid) {
//     const container = client.database(database_id).container(container_id);

//     try {
//         // Запит для отримання до 1000 записів без поля "median_sale_prices" із фільтром за appid
//         const querySpec = {
//             query: `
//                 SELECT TOP 10000 * 
//                 FROM c 
//                 WHERE NOT IS_DEFINED(c.median_sale_prices) 
//                 ${appid ? "AND c.appid = @appid" : ""}
//             `,
//             parameters: appid ? [{ name: "@appid", value: appid }] : []
//         };

//         // Виконуємо запит і отримуємо всі результати
//         const { resources: items } = await container.items.query(querySpec).fetchAll();

//         if (items.length > 0) {
//             console.log(`${items.length} items without 'median_sale_prices' retrieved successfully.`);
//             return items; // Повертаємо всі записи
//         } else {
//             console.log("No items found without 'median_sale_prices'.");
//             return [];
//         }
//     } catch (error) {
//         console.error("Error retrieving items without 'median_sale_prices':", error);
//         throw error;
//     }
// }

async function get_steam_items_without_median_sale_prices({ appid = null, limit = 1000 }) {
    const container = client.database(database_id).container(container_id);

    try {
        // Динамічна побудова запиту
        const queryParts = [
            `SELECT TOP ${limit} * FROM c`,
            `WHERE NOT IS_DEFINED(c.median_sale_prices)`
        ];

        const parameters = [];

        // Додаємо фільтрацію за appid, якщо передано
        if (appid) {
            queryParts.push(`AND c.appid = @appid`);
            parameters.push({ name: "@appid", value: appid });
        }

        const querySpec = {
            query: queryParts.join(' '),
            parameters
        };

        // Виконуємо запит і отримуємо результати
        const { resources: items } = await container.items.query(querySpec).fetchAll();

        console.log(`${items.length} items without 'median_sale_prices' retrieved successfully.`);
        return items;
    } catch (error) {
        console.error("Error retrieving items without 'median_sale_prices':", error);
        throw error;
    }
}

module.exports = {
    get_steam_item_without_median_sale_prices,
    get_steam_items_without_median_sale_prices
}