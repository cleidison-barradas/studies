const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const moment = require('moment');

// Sentry
const Sentry = require('@sentry/electron');

// Electron
const { app, ipcMain, BrowserWindow } = require('electron');
app.commandLine.appendSwitch('disable-gpu');

// Database
const sqlite = require('./src/sqlite');

// API
const createApi = require('./src/api');

// Application
const App = require('./src/app');

// Login Window
const loginWindow = require('./src/login');

// Utils
const logger = require('./src/utils/logger');
const { Color } = require('./src/utils/constants');
const isDev = require('./src/utils/is-development');

// Configuration
const config = require('./config.json');

const ROOT_PATH = path.join(app.getPath('appData'), '@mypharma');
const STORAGE = path.join(ROOT_PATH, 'data', 'db.sqlite');
const OLD_STORAGE = path.join(config.data_folder, 'db.sqlite');

let RETRIES = 3;

const initialize = () => {
    sqlite.account.findAll().then((accounts) => {
        const account = accounts[0];
        const loggedIn = account === undefined ? false : account.token !== undefined && account.token.trim().length > 0;

        if (loggedIn) {
            logger('Validating account token...', Color.FgCyan);
            validateToken().then((response) => {
                if (response === 'invalid') {
                    // Once we have logged, we need to relaunch the app
                    loginWindow.open(() => {
                        app.relaunch();
                        app.exit(0);
                    });
                } else if (response === 'error') {
                    logger('Error on validating account token. Retrying in 30 seconds...', Color.FgRed);
                    RETRIES--

                    if (!RETRIES) {
                        loginWindow.open(() => {
                            app.relaunch();
                            app.exit(0);
                        });
                    }
                    setTimeout(() => {
                        initialize();
                    }, 30000);
                } else {
                    getSQLCommands().then(({ erpSql, productSchema }) => {
                        if (erpSql.length === 0) {
                            logger('Warning: SQL instructions empty!');
                        }
                        new App(erpSql, productSchema);
                    });
                }
            });
        } else {
            logger('No account found. Opening login...', Color.FgMagenta);

            // Once we have logged, we need to relaunch the app
            loginWindow.open(() => {
                app.relaunch();
                app.exit(0);
            });
        }
    });
};

const checkConfig = () => {
    // Validate our configuration
    logger('Validating configuration...', Color.FgCyan);

    sqlite.validateConfig().then((isValid) => {
        // If we haven't a valid configuration, let's allow user to fix that
        if (!isValid) {
            sqlite.getConfig('database').then((configDatabase) => {
                sqlite.account.findAll().then((data) => {
                    const account = data[0];
                    if (account !== undefined) {
                        var currentConfig = {};
                        configDatabase.forEach((config) => {
                            currentConfig[config.key] = config.value;
                        });

                        currentConfig['erp_name'] = account.erp_name;

                        // Create window
                        const window = new BrowserWindow({
                            width: 800,
                            height: 610,
                            webPreferences: {
                                nodeIntegration: true,
                            },
                        });

                        // Load view
                        window.loadURL('file://' + path.join(__dirname, 'view/config.html'));

                        // App started, send config to frontend
                        window.on('show', () => {
                            setTimeout(() => {
                                window.webContents.send('app-ready', currentConfig);
                                console.log(currentConfig);
                            }, 1000);
                        });

                        // Save data
                        ipcMain.on('save-config', (ev, data) => {
                            var promises = [];
                            Object.keys(data).forEach((key) => {
                                const value = data[key];

                                promises.push(sqlite.createOrUpdateConfig(key, value));
                            });

                            logger('Saving configuration....', Color.FgCyan);
                            Promise.all(promises)
                                .then(() => {
                                    logger('Configuration saved!', Color.FgGreen);

                                    // Close window
                                    window.hide();

                                    // Configure sentry
                                    configureSentry(account);

                                    // Try to initialize Core again
                                    initialize();
                                })
                                .catch((err) => {
                                    logger('Failed to save configuration!', Color.FgRed);
                                    logger(err.message || err, Color.FgMagenta);
                                });
                        });
                    } else {
                        // Once we have logged, we need to relaunch the app
                        loginWindow.open(() => {
                            app.relaunch();
                            app.exit(0);
                        });
                    }
                });
            });
        } else {
            // Everything sounds fine, let's initialize app
            logger('Configuration is ok!', Color.FgGreen);
            initialize();
        }
    });
};

const validateToken = async () => {
    return createApi().then(api => {
        return api.get('v2/account/validate').then((response) => {
            const { ok, data, problem, status } = response;
            console.log(response)
            if (ok) {
                if (data.status === 'error') {
                    logger('Invalid token!', Color.FgRed);
                    logger(data, Color.FgRed);

                    return 'invalid';
                }

                logger('Account token is valid!', Color.FgGreen);
                return 'valid';
            } else {
                logger('Failed to validate the account token!', Color.FgRed);

                if (status) {
                    logger(`STATUS: ${status}`, Color.FgRed);
                }

                if (data) {
                    logger(`data: ${JSON.stringify(data)}`, Color.FgRed);
                }

                if (problem) {
                    logger(`problem: ${problem}`, Color.FgRed);
                }

                if (problem === 'CONNECTION_ERROR' || problem === 'NETWORK_ERROR' || problem === 'SERVER_ERROR' || problem === 'TIMEOUT_ERROR') {
                    return 'error';
                }

                return 'invalid';
            }
        });
    });
};

const getSQLCommands = () => {
    return new Promise((resolve, reject) => {
        logger('Getting ERP sql instructions...', Color.FgCyan);

        createApi().then((api) => {
            api.get('v1/integration/sqls/select').then((response) => {
                const { ok, data } = response;

                if (ok) {
                    const { commands, productSchema } = data.data;
                    let cmd = '';
                    if (commands) {
                        commands.forEach((str) => {
                            cmd += str;
                        });
                    }

                    logger('ERP sql instructions saved!', Color.FgGreen);
                    resolve({ erpSql: cmd, productSchema });
                } else {
                    logger('Failed to get ERP sql instructions!', Color.FgRed);
                    logger(response.status, Color.FgRed);
                    logger(JSON.stringify(response.data), Color.FgRed);

                    resolve({ erpSql: '', productSchema: null });
                }
            });
        });
    });
};

/**
 * Configure sentry
 *
 * @param {Object} account
 */
const configureSentry = (account) => {
    Sentry.configureScope((scope) => {
        scope.setUser({ id: account.user_id });
        scope.setExtra('erp', account.erp_name);
        scope.setExtra('etl_version', config.core_version_code);
    });
};

/**
 * Migration old database location to new one
 */
const databaseMigration = () => {
    try {
        logger('Migrating old storage...');
        const exists = fs.existsSync(OLD_STORAGE);
        const rootDataExists = fs.existsSync(path.join(ROOT_PATH, 'data'));

        // Create root data if does not exists
        if (!rootDataExists) {
            fs.mkdirSync(path.join(ROOT_PATH, 'data'));
        }

        // If does exists old storage, we need copy it to new one
        if (exists) {
            //fs.copyFileSync(OLD_STORAGE, STORAGE, fs.constants.COPYFILE_FICLONE_FORCE);
            fs.createReadStream(OLD_STORAGE).pipe(fs.createWriteStream(STORAGE));
        }

        // Remove old storage, we do not need it anymore
        rimraf.sync(config.data_folder);
        logger('Storage migration successfully!');
    } catch (err) {
        logger('Error on migrating database');
        logger(err.message || err);
    }
};

const delay = isDev() ? 1000 : 2000;
setTimeout(() => {
    if (!isDev()) {
        Sentry.init({ dsn: 'https://afbbb8d3bff94b34a71c9284ba46ab7b@sentry.io/1809064' });

        databaseMigration();

        logger('--------------------------------------');
        logger('Session from: ' + moment().format('DD/MM/YYYY HH:mm:sss'));
        logger('Version: ' + app.getVersion());
        logger('Database: ' + STORAGE);
        logger('Logs path: ' + app.getPath('logs'));
        logger('--------------------------------------');
    }

    logger('Initializing local database...', Color.FgCyan);
    sqlite
        .init(isDev() ? OLD_STORAGE : STORAGE)
        .then(() => {
            logger('Local database initialized!', Color.FgGreen);

            checkConfig();
        })
        .catch((err) => {
            console.log(err);
            logger(err);
        });
}, delay);
