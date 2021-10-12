process.env["NTBA_FIX_319"] = 1;
process.env["NTBA_FIX_350"] = 1;
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const { postHandler } = require('./handler');
const secretPath = './handler/secret.json'

if (!fs.existsSync(secretPath))
    fs.writeFileSync(secretPath, '{"key":""}')

const secret = require(secretPath)
if (!secret.key) {
    console.error(`Please enter you bot's API key at ${secret} file. and retry.`)
    return
}

const token = secret.key;


// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

bot.on('text', (message) => {
    postHandler(bot, message)
});
