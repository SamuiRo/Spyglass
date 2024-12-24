const SteamUser = require('steam-user')
const SteamTotp = require('steam-totp')
const SteamCommunity = require('steamcommunity')
const TradeOfferManager = require('steam-tradeoffer-manager')
const fs = require("fs")

const { STEAM_LOGIN, STEAM_PASS, TOTP } = require("../../config/app.config")

async function init(profile) {
    try {
        const steam_client = new SteamUser()
        const steam_community = new SteamCommunity()
        const steam_manager = new TradeOfferManager({
            steam: steam_client,
            community: steam_community,
            language: 'en'
        })

        await add_events_handler(steam_client, steam_community, steam_manager)

        // await on_web_session(steam_client)
        console.log("Trying to login")
        await logIn(steam_client, {
            accountName: STEAM_LOGIN,
            password: STEAM_PASS,
            twoFactorCode: SteamTotp.generateAuthCode(TOTP),
            rememberPassword: true
        })

        return {
            steam_client,
            steam_community,
            steam_manager
        }
    } catch (error) {
        console.log(error)
    }
}


async function add_events_handler(steam_client, steam_community, steam_manager) {
    try {
        steam_client.once("loggedOn", (details) => {

            console.log("client logged")
        });
        steam_client.on("webSession", (sessionID, cookies) => {
            steam_manager.setCookies(cookies)
            steam_community.setCookies(cookies)
            console.log("Cookies setled")
        })
        steam_client.on('steamGuard', (domain, callback) => {
            console.log("Steam Guard code needed from email ending in " + domain);
            // var code = getCodeSomehow();
            // callback(code);
        });
        steam_client.on("disconnected", (eresult, msg) => {
            console.log("disconnected", eresult)
            console.log("disconnected", msg)

        })
        steam_client.on("refreshToken", (refreshToken) => {

        })
        steam_client.on("tradeOffers", (count) => { })
        steam_client.on("newItems", (count) => { })
        steam_client.on("accountLimitations", (limited, communityBanned, locked, canInviteFriends) => { })
        steam_client.on("wallet", (hasWallet, currency, balance) => { })
        steam_client.on('tradeRequest', (steamID, respond) => {
            // console.log("Incoming trade request from " + steamID.getSteam3RenderedID() + ", accepting");
            // respond(true);
        });

        steam_community.on("sessionExpired", (error) => {
            if (error) steam_client.webLogOn();
            console.log("sessionExpired", error)
        });

        console.log("events added")
    } catch (error) {
        console.log(error)
    }
}

async function logIn(client, config) {
    client.logOn(config);

    return new Promise((resolve, reject) => {
        client.once("loggedOn", () => {
            console.log("| Logged into Steam")
            resolve(client)
        });
        client.once("error", (error) => {
            console.log(error)
            reject(error)
        });
    });
}

async function getItemInfo(steam_community, appID, market_hash_name, currency, timeout = 15000) {
    if (!appID || !market_hash_name || !currency) {
        throw new Error("Invalid parameters. appID, market_hash_name, and currency are required.");
    }

    return new Promise((resolve, reject) => {
        // const timeoutId = setTimeout(() => {
        steam_community.getMarketItem(appID, market_hash_name, currency, (error, item) => {
            if (error) {
                console.error(`Error fetching market item: ${error.message}`);
                reject(error);
                return;
            }

            resolve(item);
        });
        // }, timeout);

        // Додатково: очистка таймауту у випадку успішного виконання
        // timeoutId.unref(); // Для того, щоб цей таймер не тримав процес запущеним, якщо це єдина задача.
    });
}

module.exports = {
    init,
    getItemInfo,
}