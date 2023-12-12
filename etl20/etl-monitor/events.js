const path = require('path');

// Electron
const { app } = require('electron');

// Auto Update
const { autoUpdater } = require('electron-updater');

// Process finder
const processFinder = require('find-process');

// Kill process wrapper
const killProcess = require('./utils/process-kill');

// Start process wrapper
const startProcess = require('./utils/process-start');

// Async Loop
const asyncLoop = require('./utils/async-loop');

// Socket connection
const socket = require('./socket').socket();

// Database manager
const sqlite = require('./sqlite');

// Configuration
const config = require('./config.json');

// File system wrapper
const { scanDir, readFiles } = require('./utils/filesystem');

// Utils
const logger = require('./utils/logger');
const { Color } = require('./utils/constants');

// Core executable
const CORE_APP = path.join(config.installation_folder, 'etl-core', 'ETL_Core');

const ROOT_PATH = path.join(app.getPath('appData'), '@mypharma');
const CORE_LOG_PATH = path.join(ROOT_PATH, 'etl-core', 'ETL_Core', 'logs')

// Blacklisted files
const BLACKLIST = [
  '.ds_store'
]

module.exports = () => {
  // Logs were requested
  socket.on('request-logs', async (data) => {
    let { blacklist } = data
    if (typeof blacklist !== 'object' ) {
      blacklist = [];
    } 

    blacklist.push(...BLACKLIST);

    const files = await scanDir(CORE_LOG_PATH, blacklist);
    const filesContent = await readFiles(files);
  
    socket.emit('request-logs', {
      logs: filesContent
    });
  });

  // Status history requested
  socket.on('request-status-history', async () => {
    const history = await sqlite.getHistory();

    socket.emit('request-status-history', {
      history
    });
  });

  // Current status requested
  socket.on('request-current-status', async () => {
    const status = await sqlite.getCurrentStatus();
    const _process = await processFinder('name', 'ETL_Core');

    socket.emit('request-current-status', {
      status,
      process: _process
    });
  });

  // Stop core requested
  socket.on('request-stop-core', async () => {
    const _process = await processFinder('name', 'ETL_Core');
    let isKilled = _process.length > 0 ? false : true;

    await asyncLoop(_process, async (proc) => {
      const { pid } = proc;

      try {
        await killProcess(pid);
        isKilled = true;
      } catch (error) {
        logger('Could not kill ETL_Core instance!', Color.FgRed);
        logger(error);
      }
    });

    socket.emit('request-stop-core', {
      killed: isKilled
    });
  });

  // Start core requested
  socket.on('request-start-core', async () => {
    let isStarted = false;

    try {
      await startProcess(CORE_APP);
      isStarted = true;
    } catch (error) {
      logger('Could not start ETL_Core!', Color.FgRed);
      logger(error);
    } finally {
      socket.emit('request-start-core', {
        started: isStarted
      });
    }
  });

  // Run command
  socket.on('check_updates', async (data) => {
    try {
      if (data && typeof data.channel === 'string') {
        autoUpdater.channel = data.channel;
      }
  
      // Check for updates
      const result = await autoUpdater.checkForUpdates();
      
      socket.emit('check_updates', {
        status: 'success',
        result
      });
    } catch (err) {
      socket.emit('check_updates', {
        status: 'error',
        result: err.message ? err.message : JSON.stringify(err)
      });
    }
  });

  // Run command
  socket.on('exec', async (data) => {
    const { cmd } = data

    try {
      if (typeof cmd === 'string') {
        const result = await sqlite.query(cmd)

        socket.emit('exec', {
          status: 'success',
          result: result.length > 0 ? result[0] : null
        })
      } else {
        socket.emit('exec', {
          status: 'error',
          result: 'Command is not a string'
        })
      }
    } catch (err) {
      socket.emit('exec', {
        status: 'error',
        result: err.message ? err.message : JSON.stringify(err)
      })
    }
  })
}
