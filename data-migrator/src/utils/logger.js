const Color = require('./constants').Color
const moment = require('moment')

const logger = function(text, color = undefined) {
    var datetime = moment().format("HH:mm:ss")

    if (color != undefined) console.log(`${color}[${datetime}] ${text}${Color.Reset}`)
    else console.log(`${Color.Reset}[${datetime}] ${text}`)
}

module.exports = logger