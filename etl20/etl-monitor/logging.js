// Electron
const { app } = require('electron');

const fs = require('fs');
const path = require('path');
const moment = require('moment');
const isDev = require('./utils/is-development')

module.exports = (name, text) => {
    if (isDev()) return null;

    if (typeof text !== 'string') {
        text = JSON.stringify(text);
    }

    var filename = `${moment().format('YYYYMMDD')}_monitor_${name}.log`;
    var datetime = moment().format("HH:mm:ss");

    return fs.appendFileSync(path.join(app.getPath('logs'), filename), `[${datetime}] ${text}\r\n`, {encoding: 'utf8'});
    //return fs.appendFileSync(path.join('C:/mypharma/logs', filename), `[${datetime}] ${text}\r\n`, {encoding: 'utf8'});
}