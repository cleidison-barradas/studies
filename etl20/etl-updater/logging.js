const fs = require('fs');
const path = require('path');
const moment = require('moment');

// Configuration
const config = require('./config.json');

const PATH = config.log_folder;

module.exports = (name, text) => {
  if (typeof text !== 'string') {
    text = JSON.stringify(text);
  }

  var filename = `${moment().format('YYYYMMDD')}_updater_${name}.log`;
  var datetime = moment().format("HH:mm:ss");

  return fs.appendFileSync(path.join(PATH, filename), `[${datetime}] ${text}\r\n`, { encoding: 'utf8' });
}
