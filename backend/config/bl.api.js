const api = require('bricklink-api');
const Client = api.Client,
    ItemType = api.ItemType,
    Condition = api.Condition,
    Category = api.Category,
    Color = api.Color;
    
var bricklinkClient = new Client({
    "consumer_key": process.env.BRICKLINK_CONSUMERKEY,
    "consumer_secret": process.env.BRICKLINK_CONSUMERSECRET,
    "token": process.env.BRICKLINK_TOKEN,
    "token_secret": process.env.BRICKLINK_TOKENSECRET
});

module.exports = {
    bricklinkClient,
    ItemType,
    Condition,
    Category,
    Color
};