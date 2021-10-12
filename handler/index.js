const TelegramBot = require("node-telegram-bot-api")
const fs = require('fs')
const { addText } = require("./imageProcessing")
const { breakText } = require("./utils")
const whitePost = fs.readFileSync('./handler/resources/white.png')
const blackPost = fs.readFileSync('./handler/resources/black.png')



/**
 * 
 * @param {TelegramBot} bot 
 * @param {TelegramBot.Message} message 
 * @param {String} color
 */
const postHandler = async (bot, message) => {

    const data = message.text.split('|')
    if (data.length === 3) {

        const isWhite = data[0] == 'white';
        const color = isWhite ? 'black' : 'white';
        const topText = data[1];
        const text = data[2];
        // change to as many as you want.
        const maxChars = 470;
        // send the posts with parts at the bottom.
        if (text.length > maxChars) {
            const textArray = breakText(text, maxChars)
            const promises = [];
            textArray.forEach(async (text, i) => {
                const options = { text, color, topText, part: i + 1 }
                promises.push(addText(isWhite ? whitePost : blackPost, options))

            })

            await Promise.all(promises)
                .then(posts => posts.forEach((post, i) => bot.sendDocument(message.chat.id, post, {}, { filename: `post${i}.png` })))
        }
        // send the posts without parts.
        else {
            const options = { text, color, topText }
            const post = await addText(isWhite ? whitePost : blackPost, options)
            bot.sendDocument(message.chat.id, post, {}, { filename: 'post.png' })

        }
    }
    else {
        bot.sendMessage(message.chat.id, 'An error has occured')
    }

}


module.exports = {
    postHandler
}