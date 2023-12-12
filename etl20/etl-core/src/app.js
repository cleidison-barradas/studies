const path = require('path');
const { exec } = require('child_process');
const moment = require('moment');

// Application
const { app, BrowserWindow, Tray, Notification } = require('electron');

// Auto Update
const { autoUpdater } = require('electron-updater');

// Logging
const electronLog = require('electron-log');

// Auto-Launch application
const AutoLaunch = require('auto-launch');

// Api
const createApi = require('./api');

// ERP database
const database = require('./database');

// Transaction database 
const sqlite = require('./sqlite');

// Socket
const socket = require('./socket');

// Health check
const HealthCheck = require('./health-check')

// Helpers
const { parseDbResult } = require('./helpers/products-parser');

// Utils
const logger = require('./utils/logger');
const { Color } = require('./utils/constants');
const isDev = require('./utils/is-development');
const logging = require('./logging');

// Configuration
const Configuration = require('../config.json');

// Convenio ID
var ID_CONVENIO = 0;
var DATABASE_DIALECT = 'none';

// Login request
const LOGIN_APP = path.join(Configuration.installation_folder, 'ETL_Login');

// Update request
const UPDATER_APP = path.join(Configuration.installation_folder, 'ETL_Updater');

// Default health check options
const HEALTH_CHECK_DEFAULT_STATUS_LIMIT = 240 // In minutes
const HEALTH_CHECK_DEFAULT_SCHEDULE_RESTART = '7:30' // 24h format

// Default product schema
const PRODUCT_SCHEMA_DEFAULT = {
    name: {
        required: true,
    },
    laboratory: {
        required: false,
    },
    presentation: {
        required: false,
    },
    price: {
        required: true,
        delta: true,
        type: 'number'
    },
    quantity: {
        required: true,
        delta: true,
        type: 'number'
    }
}

class App {
    constructor(erpSql, productSchema = null) {
        // ERP Sql
        this.erpSql = erpSql;

        // Product Schema
        this.productSchema = productSchema || PRODUCT_SCHEMA_DEFAULT

        // When it will be?
        this.nextRun = 0;
        this.lastRun = 0;
        this.runningSync = false;

        // Current status
        this.currentStatus = 'stand-by';
        this.currentStatusLastUpdate = Date.now();
        sqlite.saveNewStatus(this.currentStatus);

        // Health Check
        this.healthCheck = new HealthCheck(HEALTH_CHECK_DEFAULT_STATUS_LIMIT, HEALTH_CHECK_DEFAULT_SCHEDULE_RESTART)

        // Do not download updates in development
        if (isDev()) {
            autoUpdater.autoDownload = false;
        }

        // Fix Windows 10 notifications
        app.setAppUserModelId(process.execPath);

        // Autoupdater settings
        this.appUpdateFound = false;

        electronLog.transports.file.file = app.getPath('logs');
        electronLog.transports.file.level = 'debug';

        autoUpdater.logger = electronLog;
        autoUpdater.autoDownload = true;
        autoUpdater.on('error', (err) => {
            logger('Applicaton update error');
            logger(err.message || err.code);
        });
        autoUpdater.on('update-available', ({ version }) => {
            logger('Application update ' + version + ' available! Starting downloading....');
            this.appUpdateFound = true;

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
        autoUpdater.on('update-not-available', () => {
            this.appUpdateFound = false;
        });
        autoUpdater.on('update-downloaded', ({ version }) => {
            logger('Application update ' + version + ' download completed! Exiting in 5 secs....');

            setTimeout(() => {
                autoUpdater.quitAndInstall(false, true)
            }, 5000)
        });

        // Update current version config
        sqlite.createOrUpdateConfig('core_version', Configuration.core_version_code);

        if (!isDev()) {
            // Configure auto-launch
            this.autoLaunch = new AutoLaunch({
                name: 'MyPharmaETL'
            });
            this.autoLaunch.disable();
            setTimeout(() => {
                this.autoLaunch.enable().then(() => {
                    logger('Registry Enabled!', Color.FgGreen);

                    // Check for app updates
                    //this.openUpdaterApp();

                    setTimeout(() => {
                        this.initialize();
                    }, 3000);
                }, err => {
                    logging('error', err.message || err);
                });
            }, 5000);
        } else {
            this.initialize();
        }

    }

    /**
     * Initialize application
     */
    async initialize() {
        const result = await sqlite.account.findAll();
        const account = result[0];
        const { user_id, erp_name, token } = account;

        // Initialize socket connection
        await this.initializeSocket(user_id, token);

        // Reset cached products
        logger(`Cleaning local products cache...`, Color.FgCyan);
        await sqlite.resetCachedProducts();

        // Get ERP Database connection config
        const dbConfig = await sqlite.getConfig('database');

        var opts = {
            erp_name
        };

        dbConfig.forEach(p => {
            opts[p.key] = p.value;
        });

        // Define vars
        ID_CONVENIO = opts.database_convenio;
        DATABASE_DIALECT = opts.database_dialect;

        this.connectDatabase(opts);
    }

    /**
     * Create App Window
     */
    createGUI() {
        const icon = isDev() ? path.join(__dirname, '../', 'resources', 'icons', 'tray.png') : path.join(process.resourcesPath, 'icons', 'app.ico')

        // Window
        this.window = new BrowserWindow({
            width: 800,
            height: 610,
            title: 'MyPharma ETL',
            webPreferences: {
                nodeIntegration: true
            }
        });
        this.window.hide();

        // Tray
        this.tray = new Tray(icon);
        this.tray.setToolTip(`Status: ${this.currentStatus}`);

        // Window events
        this.window.on('close', (ev) => {
            ev.preventDefault();
            this.window.hide();
        });

        // Tray events
        this.tray.on('double-click', () => {
            this.window.show();
        })
    }

    /**
     * Initialize socket
     */
    initializeSocket(userId, token) {
        const { socket_host } = Configuration;

        // Receive response
        socket.on('received-products', (data) => {
            const { totalAdded } = data;

            logger(`${totalAdded} were imported to ecommerce!`, Color.FgGreen);

            // Now we can run again :P
            this.runningSync = false;

            const notification = new Notification({
                title: 'Sincronização completa!',
                body: `Foram sincronizados ${totalAdded} produtos`,
                timeoutType: 'default',
            })

            notification.on('click', () => notification.close())

            // Update status
            this.setStatus('stand-by');
        });

        // Products sent
        socket.on('sent-products', (data) => {
            const { productsSent } = data;

            logger(`${productsSent} products were sent! Now the server is processing...`, Color.FgCyan);

            // Memory free
            socket.lastDataBuffer = undefined;
        });

        // Receive products
        socket.on('sync-products', async (data) => {
            const { products, total } = data;

            logger(`Cleaning remote products cache...`, Color.FgCyan);
            await sqlite.resetRemoteProducts();

            setTimeout(async () => {
                if (products.length > 0) {
                    logger(`Synchronizing ${total} remote products...`, Color.FgCyan);
                    await sqlite.saveAllRemoteProducts(products);

                    logger(`Synchronized ${total} products from remote!`, Color.FgGreen);
                } else {
                    logger(`There no remote products to be synchronized.`, Color.FgGreen);
                }

                this.sync();
            }, 5000);
        });

        // Connected
        /*socket.on('connected', async () => {
            // Update status on server
            await socket.send({
                event: 'current-status',
                data: {
                    status: this.currentStatus
                }
            });
        })*/

        logger('Connecting to socket server...', Color.FgCyan);
        return socket.init(socket_host, userId, token, app.getVersion());
    }

    /**
     * Connect to ERP database
     */
    connectDatabase(opts) {
        database.init({
            host: opts.database_hostname,
            port: opts.database_port,
            name: opts.database_name,
            user: opts.database_username,
            password: opts.database_password,
            dialect: opts.database_dialect,
            erpName: opts.erp_name
        }).then(() => {
            logger('ERP database initialized!', Color.FgCyan);

            // Initialize sync
            this.process();
        }, err => {
            logger('Could not connect to ERP database', Color.FgRed);
            logger(err, Color.FgRed);
            logger(err.message || err, Color.FgRed);

            setTimeout(() => {
                logger('Retrying connect to ERP database', Color.FgCyan);
                this.connectDatabase(opts);
            }, 6000);
        });
    }

    /**
     * Set current status
     */
    setStatus(status) {
        this.currentStatus = status;
        this.currentStatusLastUpdate = Date.now();
        return sqlite.saveNewStatus(status);
    }

    /**
     * Keep-alive everything!
     */
    async process() {
        try {
            const currentTime = new Date().getTime();

            // Health check
            this.healthCheck.check(this.currentStatusLastUpdate)


            // We can't run now
            if (currentTime >= this.nextRun && this.runningSync) {
                this.nextRun = currentTime + (15 * 60000);

                logger('Trying to run next sync circle, but there is a process running now. Readjusted to run in next 15 minutes from now.');
            }

            // If we are in stand-by, we can run our sync process again
            if (currentTime >= this.nextRun && !this.runningSync) {
                this.runningSync = true;
                this.lastRun = currentTime;

                if (!isDev()) {
                    // Check for app updates
                    //this.openUpdaterApp();

                    // Get current update channel
                    const updateConfig = await sqlite.getConfig('update');
                    const updateChannel = updateConfig.find(p => p.key === 'update_channel');
                    autoUpdater.channel = updateChannel ? updateChannel.value : 'latest';

                    try {
                        await autoUpdater.checkForUpdates();

                        // If app updates were found, we cannot go on
                        // So we are going to stop here and wait for the app download and itself quit for installation
                        if (this.appUpdateFound) {
                            return;
                        }
                    } catch (err) {
                        logger(err);
                        logger(updateChannel);
                    }
                }

                const validToken = await this.validateToken();
                if (validToken === 'valid') {
                    this.updateNextRun();

                    this.syncRemoteProducts();
                }
                else if (validToken === 'error') {
                    logger('Error on validating account token. Retrying in 60 seconds.');

                    this.nextRun = currentTime + 30000;
                    this.runningSync = false;
                } else {
                    this.openLoginApp().then(() => {
                        app.quit();
                    }, err => {
                        logger(err, Color.FgRed);
                    });
                }
            }
        } catch (error) {
            logger('Error on sync circle');
            logger(error);
        } finally {
            setTimeout(() => {
                this.process();
            }, 60000);
        }
    }

    /**
     * Sync products
     */
    async sync() {
        const deltaProducts = await this.syncLocalProducts();
        if (deltaProducts.length === 0) {
            this.runningSync = false;

            logger('Nothing local has changed!', Color.FgGreen);

            // Update status
            await this.setStatus('stand-by');
        } else {
            this.processProducts(deltaProducts, async (result) => {
                const { products } = result;

                if (products.length === 0) {
                    this.runningSync = false;

                    logger('Nothing between local and remote has changed, life goes on!', Color.FgGreen);

                    // Update status
                    await this.setStatus('stand-by');
                } else {
                    logger(`Sending ${products.length} products...`, Color.FgCyan);

                    // Only for debugging
                    //logging(`send_data_${moment().format('HHmm')}`, JSON.stringify(products));

                    // Update status
                    await this.setStatus('sending');

                    await socket.send({
                        event: 'send-products',
                        data: {
                            products
                        }
                    });
                }
            });
        }
    }

    /**
     * Update next sync run time
     */
    updateNextRun() {
        sqlite.getConfig('sync').then(config => {
            const syncInterval = config.find(p => p.key === 'sync_interval');

            if (syncInterval !== undefined) {
                const currentTime = new Date().getTime();
                const interval = Number(syncInterval.value) * 60000;

                this.nextRun = currentTime + interval;
            } else {
                logger('Could not find sync interval config', Color.FgRed);
                app.quit();
            }
        });
    }

    /**
     * Sync remote products with local database
     */
    async syncRemoteProducts() {
        try {
            logger('Requesting remote products...', Color.FgCyan);

            // Update status
            this.setStatus('sync-remote');

            // Request products
            await socket.send({
                event: 'sync-products'
            });
        } catch (error) {
            // Looks like we do not have valid keys, so we need to login again
            if (typeof error.code === 'string' && error.code === 'invalid_encrypt_keys') {
                logging('error', 'Encrypt keys are not valid anymore, need login again');

                await this.openLoginApp();
                app.quit();
            } else {
                logger('ERROR: Failed to sync REMOTE products!');
                logger(error);
            }
        }
    }

    /**
     * Sync local ERP products with local database
     */
    async syncLocalProducts() {
        try {
            logger('Synchronizing local products...', Color.FgCyan);

            // Update status
            this.setStatus('sync-local');

            // Load products from ERP
            const products = await this.loadProducts();

            // Parse products
            logger('Parsing products. Total: ' + products.length);

            const parsedProducts = await parseDbResult(products, this.productSchema);
            const total = parsedProducts.length;

            // Delta products
            const delta = [];

            for await (let product of parsedProducts) {
                const { status } = await sqlite.saveOriginalProduct(product);

                // Product has changed
                if (status === 'updated' || status === 'created') {
                    delta.push(product);
                }
            }
            logger(`Synchronized ${total} products from local!`);

            return delta;
        } catch (error) {
            logger('ERROR: Failed to sync LOCAL products!');
            logger(error)
        }
    }

    loadProducts() {
        return new Promise((resolve, reject) => {
            if (DATABASE_DIALECT === 'txt' || DATABASE_DIALECT === 'ftp' || DATABASE_DIALECT === 'dbf') {
                database.query().then(result => {
                    resolve(result)
                }, err => {
                    reject(err);
                });
            } else {
                // Setup convenio
                let parsedSql = this.erpSql.replace(new RegExp(':idConvenio', 'g'), ID_CONVENIO);

                // Setup vars
                parsedSql = parsedSql.replace(new RegExp(':currentDate', 'g'), moment().format('YYYY-MM-DD'));
                parsedSql = parsedSql.replace(new RegExp(':currentLocaleDate', 'g'), moment().format('DD/MM/YYYY'));

                database.query(parsedSql).then(result => {
                    resolve(result);
                }, err => {
                    reject(err);
                });
            }
        });
    }

    /**
     * Validate account token
     */
    async validateToken() {
        return createApi().then(api => {
            return api.get('v2/account/validate').then(response => {
                const { ok, data, problem } = response;

                if (ok) {
                    const { status } = data;

                    if (status === 'error') {
                        logger('Invalid token!', Color.FgRed);
                        logger(data, Color.FgRed);

                        return 'invalid';
                    }

                    logger('Account token is valid!', Color.FgGreen);
                    return 'valid';
                } else {
                    logger('Failed to validate the account token!', Color.FgRed);
                    logger(response.status, Color.FgRed);
                    logger(JSON.stringify(response.data), Color.FgRed);

                    if (problem === 'CONNECTION_ERROR' || problem === 'NETWORK_ERROR' || problem === 'SERVER_ERROR' || problem === 'TIMEOUT_ERROR') {
                        return 'error';
                    }

                    return 'invalid';
                }
            }, err => {
                logging('error', err.message || err);

                return 'error';
            });
        });
    }

    /**
     * Open login app for autentication
     */
    openLoginApp() {
        return new Promise((resolve, reject) => {
            var result = '';

            switch (process.platform) {
                case 'darwin':
                    var child = exec(`open ${LOGIN_APP}.app`);
                    break;
                case 'win32':
                case 'win64':
                    var child = exec(`${LOGIN_APP}.exe`);
                case 'linux':
                    var child = exec(`${LOGIN_APP}.bin`);
                    break;
            }

            child.stdout.on('data', (data) => {
                result += data;
            });

            child.on('error', (err) => {
                console.log(err);
            });

            child.on('exit', () => {
                resolve(result);
            });
        });
    }

    /**
     * Open updater app
     */
    openUpdaterApp() {
        switch (process.platform) {
            case 'darwin':
                exec(`open ${UPDATER_APP}.app versionCode=${Configuration.core_version_code} openCore=true`);
                break;
            case 'win32':
            case 'win64':
                exec(`${UPDATER_APP}.exe versionCode=${Configuration.core_version_code} openCore=true`);
            case 'linux':
                exec(`${UPDATER_APP}.bin versionCode=${Configuration.core_version_code} openCore=true`);
                break;
        }
    }

    /**
     * Save remote products to our SQLite database
     * 
     * DEPRECEATED
     * DEPRECEATED
     * DEPRECEATED
     * DEPRECEATED
     * DEPRECEATED
     * 
     * @param {Array} productsArray 
     * @param {Function} callback 
     */
    saveRemoteProducts(productsArray, callback) {
        if (productsArray.length > 0) {
            var product = productsArray[0];

            sqlite.saveProduct(product).then(() => {
                productsArray.splice(0, 1);
                this.saveRemoteProducts(productsArray, callback);
            }, err => {
                logging('error', err.message || err);

                productsArray.splice(0, 1);
                this.saveRemoteProducts(productsArray, callback);
            });
        } else {
            callback();
        }
    }

    /**
     * Save ERP products to our SQLite database
     * 
     * @param {Array} productsArray 
     * @param {Function} callback
     */
    saveLocalProducts(productsArray, callback, tmp = {}) {
        if (tmp.deltaProducts === undefined) {
            tmp.deltaProducts = [];
        }

        if (productsArray.length > 0) {
            var product = productsArray[0];

            sqlite.saveOriginalProduct(product).then(data => {
                const { status } = data;

                if (status === 'updated' || status === 'created') {
                    tmp.deltaProducts.push(product);
                }

                productsArray.splice(0, 1);
                this.saveLocalProducts(productsArray, callback, tmp);
            }, err => {
                logging('error', err.message || err);

                productsArray.splice(0, 1);
                this.saveLocalProducts(productsArray, callback, tmp);
            });
        } else {
            callback(tmp);
        }
    }

    /**
     * Process products to filter and save those who has been changed on the Ecommerce database
     * 
     * @param {Array} productsArray 
     * @param {Function} callback 
     */
    processProducts(productsArray, callback, tmp = {}) {
        if (tmp.totalProducts === undefined) {
            tmp.totalProducts = productsArray.length;
            logger(`Started processing products. Total: ${tmp.totalProducts}`, Color.FgCyan);

            // Update status
            this.setStatus('processing');
        }

        if (tmp.products === undefined) {
            tmp.products = [];
        }

        if (productsArray.length > 0) {
            var product = productsArray[0];

            sqlite.productDiff(product, this.productSchema).then(isDifferent => {
                if (isDifferent) {
                    tmp.products.push(product);
                }

                productsArray.splice(0, 1);
                this.processProducts(productsArray, callback, tmp);
            }, err => {
                console.log(err);
                logging('error', err.message || err);

                productsArray.splice(0, 1);
                this.processProducts(productsArray, callback, tmp);
            });
        } else {
            callback(tmp);
        }
    }
}

module.exports = App;