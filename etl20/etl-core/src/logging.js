const fs = require('fs');
const path = require('path');
const moment = require('moment');

// Electron
const { app } = require('electron')

module.exports = (name, text) => {
    if (typeof text !== 'string') {
        text = JSON.stringify(text);
    }

    var filename = `${moment().format('YYYYMMDD')}_core_${name}.log`;
    var datetime = moment().format("HH:mm:ss");

    return fs.appendFileSync(path.join(app.getPath('logs'), filename), `[${datetime}] ${text}\r\n`, {encoding: 'utf8'});
}