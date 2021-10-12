const { createCanvas, loadImage, registerFont } = require('canvas')
const path = require('path')
registerFont(path.join(__dirname, '/resources/DanaYadAlefAlefAlef-Normal.otf'), { family: 'Dana Yad AlefAlefAlef' })


/**
 * find the min size of font size and wrapping needed for the text.
 * @param {*} ctx canvas context.
 * @param {*} words array of words to check wraping for.
 * @param {*} fontSize the font size currently used.
 * @param {*} maxWidth the max width allowed.
 * @returns {Object} { lines, fontSize }
 */
function wrapLines(ctx, words, fontSize, maxWidth, maxRows) {
    ctx.font = `${fontSize}px Dana Yad AlefAlefAlef Normal`
    let lines = [],
        space = ctx.measureText(' ').width,
        width = 0,
        line = '',
        word = '',
        len = words.length,
        w = 0,
        noFit = false,
        i;
    for (i = 0; i < len; i++) {
        word = words[i];
        w = word ? ctx.measureText(word).width : 0;
        if (w) {
            width += space + w;
        }
        if (w > maxWidth || word.length > 20) {
            lines.push(word);
        } else if (w && width < maxWidth) {
            line += (i ? ' ' : '') + word;
        } else {
            !i || lines.push(line !== '' ? line.trim() : '');
            line = word;
            width = w;
        }
    }
    if (len !== i || line !== '') {
        lines.push(line.trim());
    }
    lines.forEach(line => {
        if (ctx.measureText(line).width > maxWidth)
            noFit = true
    })
    // if the line doesn't fit inside the box of maxWidth or we have more than maxRows lines, 
    // call the function recursively with a smaller fontSize.
    if (noFit || lines.length > maxRows || (lines.length * fontSize * 1.2) > maxWidth * 0.7) {
        if (fontSize > 150)
            fontSize -= 10
        else if (fontSize > 100)
            fontSize -= 5
        else if (fontSize > 80)
            fontSize -= 1
        else
            fontSize -= 0.5

        return wrapLines(ctx, words, fontSize, maxWidth, maxRows)
    }
    return { lines: lines, fontSize: fontSize };
}
/**
 * helper function for addText.
 * @param {*} text text to return array for.
 * @returns array of words from text.
 */
function getWords(text) {
    return text.replace(/\n\n/g, ' ` ').replace(/(\n\s|\s\n)/g, '\r')
        .replace(/\s\s/g, ' ').replace('`', ' ').replace(/(\r|\n)/g, ' ' + ' ').split(' ')
}


/**
 * Add text to an image.
 *
 * @param {*} buffer the buffer image.
 * @param {*} options 
 * @returns image with text on it.
 */
const addText = (buffer, options = {}) => new Promise((resolve, reject) => {
    const destFromTopBorder = 150;
    const text = options.text
    const topText = options.topText

    const isParts = !!options.part

    // Edit to your likings.
    const partsLocation = { width: 1030, height: 980 }
    // color for fill.
    let fillColor = options.color;


    // Max rows.
    options.rows = 10;


    const canvas = createCanvas()
    const ctx = canvas.getContext('2d')

    return loadImage(buffer)
        .then(img => {
            const width = canvas.width = img.width
            const height = canvas.height = img.height

            // Edit to your likings.
            const topTextLocation = { width: width / 2, height: 50 }

            ctx.drawImage(img, 0, 0)
            ctx.fillStyle = fillColor;
            ctx.textAlign = 'center'

            // calculate base font size to start with.
            const baseFontSize = Math.floor(width / 5);

            var { lines, fontSize } = wrapLines(ctx, getWords(text), baseFontSize, width - 80, options.rows)
            ctx.lineWidth = Math.floor(fontSize / 10) + 5;
            ctx.textBaseline = 'top';
            const space = (height - destFromTopBorder * 2) / lines.length

            lines.forEach((line, i) => {
                ctx.fillText(line, width / 2, space * i + destFromTopBorder)
            })

            // For top text.
            ctx.font = `60px Dana Yad AlefAlefAlef Normal`
            ctx.textAlign = 'center'
            ctx.fillText(topText, topTextLocation.width, topTextLocation.height)

            // For parts.
            if (isParts) {
                ctx.font = `55px Dana Yad AlefAlefAlef Normal`
                ctx.textAlign = 'right'
                ctx.fillText(`חלק ${options.part}`, partsLocation.width, partsLocation.height)
            }

            const outBuffer = canvas.toBuffer('image/png')
            resolve(outBuffer);
        })
        .catch(err => {
            console.error(err);
            reject(err);
        })

})



module.exports = {
    addText
}