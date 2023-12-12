const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const processFinder = require('find-process');
const extract = require('extract-zip');
const psNode = require('ps-node');
const Request = require('request');

// Electron
const { app } = require('electron');

// Api
const api = require('./api');

// Utils
const logger = require('./utils/logger');
const { Color } = require('./utils/constants');
const argsParser = require('./utils/arguments');

// Configuration
const config = require('./config.json');

// Read arguments
const _args = argsParser(process.argv);

const CORE_APP = path.join(config.installation_folder, 'ETL_Core');
const LOGIN_APP = path.join(config.installation_folder, 'ETL_Login');
const MONITOR_APP = path.join(config.installation_folder, 'ETL_Monitor');
const ZIP_FILE = path.join(config.installation_folder, 'update.zip');
const CURRENT_VERSION = _args.versionCode ? Number(_args.versionCode) : 20;
const OPEN_CORE = _args.openCore ? Boolean(_args.openCore) : false;

/**
 * Kill process wrapper
 */
const killProcess = (pid) => {
  return new Promise((resolve, reject) => {
    psNode.kill(pid, (err) => {
      if (err) reject(err);
      else resolve(true);
    })
  });
}

/**
 * Delete existing ETL installation
 */
const deleteExistingBinaries = async () => {
  const coreApp = await fs.existsSync(CORE_APP);
  const loginApp = await fs.existsSync(LOGIN_APP);
  const monitorApp = await fs.existsSync(MONITOR_APP);

  if (coreApp) {
    await fs.unlink(CORE_APP, (err) => {
      if (err) throw err;
    });
  }

  if (loginApp) {
    await fs.unlink(LOGIN_APP, (err) => {
      if (err) throw err;
    });
  }

  if (monitorApp) {
    await fs.unlink(MONITOR_APP, (err) => {
      if (err) throw err;
    });
  }

  return true;
}

/**
 * Delete update zip file
 */
const deleteUpdateFile = async () => {
  const existZipFile = await fs.existsSync(ZIP_FILE);

  if (existZipFile) {
    await fs.unlink(ZIP_FILE, (err) => {
      if (err) throw err;
    });
  }

  return true;
}

/**
 * Stop running app
 */
const stopCoreApp = (name) => {
  return processFinder('name', name).then(list => {
    if (list.length === 0) return true;

    const promises = [];
    list.forEach(proc => {
      promises.push(killProcess(proc.pid));
    });

    return Promise.all(promises).then(() => {
      return true;
    }, (err) => {
      logger(err);
      return true;
    });
  }, (err) => {
    logger(err);
    return true;
  });
}

/**
 * Create env folders
 */
const createFolders = async () => {
  const existLogs = await fs.existsSync(config.log_folder);
  const existData = await fs.existsSync(config.data_folder);

  if (!existLogs) {
    await fs.mkdirSync(config.log_folder);
  }

  if (!existData) {
    await fs.mkdirSync(config.data_folder);
  }
}

/**
 * Find newer version
 */
const findVersion = async () => {
  const response = await api.getUpdate(CURRENT_VERSION);
  const { data, ok, problem } = response;

  if (ok) return data;
  else if (problem === 'CONNECTION_ERROR' || problem === 'NETWORK_ERROR' || problem === 'TIMEOUT_ERROR') throw 'fetching_error';
  else return undefined;
}

/**
 * Download binary
 */
const download = (url) => {
  return new Promise((resolve, reject) => {
    const request = Request(url);
    
    let fileLength = 0;
    let currentLength = 0;

    // Something is wrong on downloading the file
    request.on('error', (err) => {
      console.log(err)
      reject(err);
    });

    // Get file info
    request.on('response', (response) => {
      const { headers } = response;

      fileLength = parseInt(headers['content-length']);
    });

    // Update progress
    request.on('data', (chunk) => {
      let perc = (100 * currentLength / fileLength).toFixed(2);
      if (perc % 5 === 0) {
        logger(`Downloaded: ${perc}%`, Color.FgCyan);
      }

      currentLength += chunk.length;
    });

    request.on('complete', () => {
      logger('Downloaded successfully!', Color.FgGreen);
      resolve(true);
    })

    request.pipe(fs.createWriteStream(ZIP_FILE));

  });
}

/**
 * Unzip update file
 */
const unzip = () => {
  return new Promise((resolve, reject) => {
    extract(ZIP_FILE, {
      dir: config.installation_folder
    }, (err) => {
      if (err) reject(err);
      else resolve(true);
    })
  })
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
  try {
    // Setup env
    await createFolders();

    const foundVersion = await findVersion();

    if (foundVersion === undefined) {
      logger('No updates found!');
      app.quit();
    } else {
      const { url, version } = foundVersion;

      logger(`New version found: ${version}`, Color.FgGreen);

      // Stopping running Core instances
      logger('Stopping running instances...', Color.FgCyan);
      await stopCoreApp('ETL_Core');
      await stopCoreApp('ETL_Monitor');

      // Download update
      logger('Downloading...');
      await download(url);

      // Delete existing app binaries
      logger('Deleting existing binaries...', Color.FgCyan);
      await deleteExistingBinaries();

      // Extract new binaries
      logger('Extracting new binaries...', Color.FgCyan);
      await unzip();

      // Delete update file
      logger('Deleting update file...', Color.FgCyan);
      await deleteUpdateFile();

      logger('ETL 2.0 updated successfully!!!', Color.FgGreen);

      if (OPEN_CORE) {
        exec(`${CORE_APP}.exe appUpdated`);
        exec(`${MONITOR_APP}.exe`);
      }


      app.quit();
    }

  } catch (error) {
    if (error === 'fetching_error') {
      logger(`Couldn't fetch the API for get info about versioning. We gonna retry a few moment.`, Color.FgRed);
      setTimeout(() => {
        init();
      }, 5000)
    } else {
      logger(error);
    }
  }
}

(async () => {
  return await init();
})();
