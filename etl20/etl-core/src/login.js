const path = require('path');

// Electron
const { BrowserWindow, ipcMain } = require('electron');

// Configuration
const config = require('../config.json');

// Database
const sqlite = require('./sqlite');

// Logging
const logging = require('./logging');

class LoginWindow {
    window = null

    close() {
        this.window.close();
    }

    open(callback = null) {
        // Create window if does not exists
        if (this.window === null) {
            this.createWindow();
        }

        /**
         * Renderer events
         */
        ipcMain.on('render-ready', (e) => {
            const { api } = config;

            //Check if account token is valid
            sqlite.account.findAll().then(data => {
                const account = data[0];
                const token = account ? account.token : '';
                const user_id = account ? account.user_id : null;

                setTimeout(() => {
                    this.window.webContents.send('app-ready', {
                        user_id,
                        token,
                        apiLoginUrl: api.login,
                        apiValidateSession: api.validate,
                        apiRenewSession: api.renew
                    });
                }, 1000);
            });
        });

        ipcMain.on('logged', (e, data) => {
            const { user_id, erp_name, token, publicKey } = data;

            sqlite.saveAccount(user_id, erp_name, token, publicKey).then(() => {
                this.window.close();
                this.window = null;

                // We have logged :D
                if (callback) {
                    callback();
                }
            }).catch(err => {
                logging('error', 'Failed to log in');
                logging('error', err.message);
                this.window.webContents.send('login-error', err);
            });
        });

        ipcMain.on('renew-keys', (e, data) => {
            const { user_id, publicKey } = data;

            sqlite.saveKey(user_id, publicKey).then(() => {
                this.window.close();
                this.window = null;

                // Keys were renewed
                if (callback) {
                    callback();
                }
            }).catch(err => {
                logging('error', 'Failed to renew keys');
                logging('error', err.message);
                this.window.webContents.send('login-error', err);
            })
        });

        ipcMain.on('append-log', (e, text) => {
            logging('login', text);
        });
    }

    createWindow() {
        this.window = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true
            }
        });

        // Load view
        this.window.loadURL('file://'+path.join(__dirname, '../', 'view/login.html'));

        // Destroy window when closed
        this.window.on('closed', () => {
            this.window = null;
        });
    }
}

module.exports = new LoginWindow();
