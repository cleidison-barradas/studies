const Color = require('./constants').Color;
const moment = require('moment');

const logger = function(text, color = undefined, type = 'log') {
    var datetime = moment().format("HH:mm:ss");

    let _logger = console.log;
    if (type === 'warn') {
        _logger = console.warn;
    }

    if (color != undefined) _logger(`${color}[${datetime}] ${text}${Color.Reset}`);
    else _logger(`${Color.Reset}[${datetime}] ${text}`);
}

module.exports = logger;