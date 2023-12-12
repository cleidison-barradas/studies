const fs = require('fs');
const path = require('path');

// Electron
const { app, Notification } = require('electron');

// Auto Update
const { autoUpdater } = require('electron-updater');

// Auto-Launch application
const AutoLaunch = require('auto-launch');

// Logging
const electronLog = require('electron-log');

// ETL Local database
const sqlite = require('./sqlite');

// Socket Wrapper
const socket = require('./socket');

// Configuration
const config = require('./config.json');

// Utils
const logger = require('./utils/logger');
const { Color } = require('./utils/constants');
const isDev = require('./utils/is-development');

const ROOT_PATH = isDev() ? config.installation_folder : path.join(app.getPath('appData'), '@mypharma');
const STORAGE = path.join(ROOT_PATH, 'data', 'db.sqlite');

/**
 * Configure auto-lauch
 */
const autoLaunch = () => {
  return new Promise((resolve, reject) => {
    if (!isDev()) {
      // Configure auto-launch
      const autoLaunch = new AutoLaunch({
        name: 'MyPharmaETLMonitor'
      });
      
      autoLaunch.disable();
    
      setTimeout(() => {
        autoLaunch.enable().then(() => {
          logger('Registry Enabled!', Color.FgGreen);
  
          setTimeout(() => {
            resolve(true);
          }, 3000);
        }, err => {
          logger('Could not enable auto-lauch!');
          reject(err);
        });
      }, 5000);
    } else {
      resolve(true);
    }
  })
}

/**
 * Configure application auto-update
 */
const appAutoUpdate = () => {
  // Autoupdater settings
  electronLog.transports.file.file = app.getPath('logs');
  electronLog.transports.file.level = 'debug';

  autoUpdater.channel = 'latest';
  autoUpdater.autoDownload = true;
  autoUpdater.logger = electronLog;
  autoUpdater.on('error', (err) => {
    logger('Applicaton update error');
    logger(err.message || err.code);
  });

  autoUpdater.on('update-available', ({ version }) => {
    logger('Application update ' + version + ' available! Starting downloading....');

    const updateNotification = new Notification({
      title: 'Atualização Disponível',
      body: `Baixando nova versão: ${version}`,
      timeoutType: 'default',
      silent: true
    });
    updateNotification.on('click', () => {
        updateNotification.close();
    });
});

  autoUpdater.on('update-downloaded', ({ version }) => {
    logger('Application update ' + version + ' download completed! Exiting in 5 secs....');

    setTimeout(() => {
        autoUpdater.quitAndInstall(false, true)
    }, 5000)
  });
}

/**
 * Connect to SQLite database
 */
const connectSQLite = async () => {
  try {
    await sqlite.init(STORAGE);
  } catch (error) {
    logger('Error to connect to SQLite: ' + STORAGE);
    logger(error);
  }
}

/**
 * Connect Socket
 */
const connectSocket = async () => {
  try {
    const { monitor_socket_host } = config;
    const account = await sqlite.account.findOne();
    const coreConfig = await sqlite.getConfig('core_version');

    if (!account) {
      logger('Not logged. Please open ETL_Core first!')
      return false;
    }

    const { user_id, token } = account;
    const coreVersion = coreConfig ? Number(coreConfig.value) : 0;
    const appVersions = JSON.stringify({
      core: coreConfig.value,
      monitor: app.getVersion()
    })

    return await socket.connect(monitor_socket_host, user_id, token, coreVersion, appVersions);
  } catch (error) {
    logger('Failed to connect socket: ' + monitor_socket_host + ' - Error: ' + error.message);
  }
}

/**
 * ============================================================================================
 * ============================================================================================
 * ============================================================================================
 */

/**
 * Initialize everything!!
 */
const init = async () => {
  if (!isDev()) {
    logger(app.getPath('logs'));
  }

  try {
    if (!isDev()) {
      // App auto update
      appAutoUpdate();

      // Check for updates
      await autoUpdater.checkForUpdates();

      // Enable auto launch
      await autoLaunch();
    }

    // Connect database
    logger('Connecting to ETL database...', Color.FgCyan);
    await connectSQLite();

    // Connect socket
    logger('Connecting to socket server...', Color.FgCyan);
    await connectSocket();

    logger('Listening for events!', Color.FgGreen);
    require('./events')();

  } catch (error) {
    console.log(error)
    logger(error.message);
    logger(JSON.stringify(error));
  }
}

(async () => {
  return await init();
})();

module.exports = {
  appAutoUpdate
}