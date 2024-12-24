const { client, database_id } = require("./cosmos.client")

const container_id = "Steam_Item";

async function upsert_steam_item(item) {
    const container = client.database(database_id).container(container_id);

    try {
        // Пошук існуючого елементу за унікальною комбінацією
        const querySpec = {
            query: "SELECT * FROM c WHERE c.market_hash_name = @market_hash_name AND c.appid = @appid",
            parameters: [
                { name: "@market_hash_name", value: item.market_hash_name },
                { name: "@appid", value: item.appid }
            ]
        };

        const { resources: items } = await container.items.query(querySpec).fetchAll();

        if (items.length > 0) {
            // Оновлення існуючого запису
            const existingItem = items[0];
            item.id = existingItem.id; // Вказуємо ідентифікатор існуючого елемента для оновлення
        }

        // Створення або оновлення запису
        const { resource: upsertedItem } = await container.items.upsert(item);
        console.log("Item upserted successfully:", upsertedItem);
        return upsertedItem;
    } catch (error) {
        console.error("Error upserting item:", error);
        throw error;
    }
}

async function get_all_old_steam_items() {
    try {
        const container = client.database(database_id).container('Steam_Items');

        const { resources: items } = await container.items.readAll().fetchAll();
        return items;
    } catch (error) {
        console.log(error)
    }
}

async function get_all_steam_items() {
    const container = client.database(database_id).container(container_id);

    try {
        // Запит для отримання всіх записів
        const querySpec = {
            query: "SELECT * FROM c"
        };

        const { resources: items } = await container.items.query(querySpec).fetchAll();

        console.log("Items retrieved successfully:");
        return items;
    } catch (error) {
        console.error("Error retrieving items:", error);
        throw error;
    }
}

async function get_all_steam_items_without_median() {
    const container = client.database(database_id).container(container_id);

    try {
        // Запит для отримання всіх записів без поля "median"
        const querySpec = {
            query: "SELECT * FROM c WHERE NOT IS_DEFINED(c.median_sale_prices)"
        };

        const { resources: items } = await container.items.query(querySpec).fetchAll();

        console.log("Items without 'median' retrieved successfully:");
        return items;
    } catch (error) {
        console.error("Error retrieving items without 'median':", error);
        throw error;
    }
}

async function clear_container() {
    const container = client.database(database_id).container(container_id);

    try {
        // Отримати всі документи в контейнері
        const { resources: items } = await container.items.query("SELECT * FROM c").fetchAll();

        // Видалення кожного документа
        for (const item of items) {
            await container.item(item.id, item.partitionKey).delete();
        }

        console.log("Container cleared successfully.");
    } catch (error) {
        console.error("Error clearing container:", error);
        throw error;
    }
}

module.exports = {
    upsert_steam_item,
    get_all_steam_items,
    clear_container
}