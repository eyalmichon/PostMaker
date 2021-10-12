/**
 * break text to parts of maxChar chars max each, if is too long.
 * @param {String} text 
 */
const breakText = (text, maxChars) => {
    const numOfParts = Math.ceil(text.length / maxChars);
    const separation = Math.ceil(text.length / numOfParts);
    let pos = 0;

    const finalText = []
    for (let i = 0; i < numOfParts - 1; i++) {
        let temp = text.slice(0, separation)
        pos = temp.length - 1;

        // find space.
        while (temp[pos] !== ' ')
            pos--;

        finalText.push(text.slice(0, pos))
        text = text.slice(pos)
    }
    // left-over
    if (!!text)
        finalText.push(text)

    return finalText
}


module.exports = {
    breakText
}