const Color = require('./constants').Color;
const moment = require('moment');
const logging = require('../logging');

const logger = function(text, color = undefined) {
    var datetime = moment().format("HH:mm:ss");
    var formatedText = color === undefined ? `${Color.Reset}[${datetime}] ${text}` : `${color}[${datetime}] ${text}${Color.Reset}`;

    console.log(formatedText);
    logging('app', text);
}

module.exports = logger;
