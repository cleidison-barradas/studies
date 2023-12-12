const Color = require('./constants').Color
const moment = require('moment')
const readline = require('readline')

const clearLine = process.stdout.clearLine || readline.clearLine
const cursorTo = process.stdout.cursorTo || readline.cursorTo

/**
 * Live logger text in same line
 * 
 * @param {String} text
 * @param {Color} color
 */
module.exports = (text, color = undefined) => {
  let datetime = moment().format("HH:mm:ss")

  clearLine()
  cursorTo(0)

  if (color !== undefined) process.stdout.write(`${color}[${datetime}] ${text}${Color.Reset}`)
  else process.stdout.write(`${Color.Reset}[${datetime}] ${text}`)
}