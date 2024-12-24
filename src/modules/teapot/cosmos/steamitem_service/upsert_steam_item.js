const { client, database_id } = require("../cosmos.client")

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

module.exports = {
    upsert_steam_item
}