const fs = require('fs');
const path = require('path');

// Module alias
const moduleAlias = require('module-alias');

// Load envs
require('dotenv').config();

module.exports = (async () => {
  const appSrc = path.join(__dirname, 'src');
  const storagePath = path.join(__dirname, 'storage');
  const logPath = path.join(storagePath, 'log');

  // Setup module alias
  const directories = await fs.promises.readdir(appSrc);
  directories
    .filter((dir) => !dir.includes('.'))
    .forEach((dir) => {
      // Add path alias
      moduleAlias.addAlias(`myp-admin/${dir}`, path.join(appSrc, dir));
    });

  // Setup storage temp folders
  try {
    await fs.promises.access(logPath, fs.constants.F_OK);
  } catch (err) {
    // If log folder does not exists, we should create it
    if (err.code === 'ENOENT') {
      await fs.promises.mkdir(err.path);
    }
  }

  // Load our application
  await require('./src/app')();
})();
