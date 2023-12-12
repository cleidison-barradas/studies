const path = require('path');
const fs = require('fs');
const moment = require('moment');

// Configuration
const config = require('./config.json');

const PATH = config.log_folder;

module.exports = (text) => {
    var filename = `${moment().format('YYYYMMDD')}_login.log`;
    var datetime = moment().format("HH:mm:ss");

    const folderExist = fs.existsSync(PATH);

    if (!folderExist) {
        fs.mkdirSync(PATH);
    }

    return fs.appendFileSync(path.join(PATH, filename), `[${datetime}] ${text}\r\n`, {encoding: 'utf8'});
}