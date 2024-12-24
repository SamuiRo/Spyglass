const { CosmosClient } = require("@azure/cosmos");
const { AZURE_ENDPOINT, AZURE_KEY, AZURE_DB_ID } = require("../../../config/app.config");

const client = new CosmosClient({ endpoint: AZURE_ENDPOINT, key: AZURE_KEY });

module.exports = {
    client,
    database_id: AZURE_DB_ID
};