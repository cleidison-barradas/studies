const path = require('path');
const { exec } = require('child_process');
const { app, BrowserWindow, ipcMain } = require('electron');

// Configuration
const config = require('./config.json');

// Database
const sqlite = require('./sqlite');

// Logging
const logging = require('./logging');
console.log = logging;

const SQLITE_DATABASE = path.join(config.data_folder, 'db.sqlite');
const CORE_APP = path.join(config.installation_folder, 'ETL_Core');

class MainWindow {
    constructor() {
        // Initialize application
        app.on('ready', () => {
            this.createWindow();
        });

        // Finalize application when there's nothing else
        app.on('window-all-closed', () => {
            console.log("closed");

            if (process.platform !== 'darwin') {
                app.quit();
            }
        });

        // Recreate the window if it's been closed improperly, very common on macOS
        app.on('activate', () => {
            if (this.window === null) {
                this.createWindow();
            }
        });

        /**
         * Renderer events
         */
        ipcMain.on('render-ready', (e) => {
            const { api } = config;

            // Initialize database
            sqlite.init(SQLITE_DATABASE).then(() => {
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
            }, (err) => {
                console.log(err);
                app.quit();
            });
        })

        ipcMain.on('logged', (e, data) => {
            const { user_id, erp_name, token, publicKey } = data;

            sqlite.saveAccount(user_id, erp_name, token, publicKey).then(() => {
                console.log("success");

                // Open core application
                this.openCoreApp().then(() => {
                    setTimeout(() => {
                        app.quit();
                    }, 3000);
                })
            }, (err) => {
                console.log("fail");
                console.log(err);
                this.window.webContents.send('login-error', err);
            }).catch(err => {
                console.log("fail");
                console.log(err);
                this.window.webContents.send('login-error', err);
            })
        });

        ipcMain.on('renew-keys', (e, data) => {
            const { user_id, publicKey } = data;

            sqlite.saveKey(user_id, publicKey).then(() => {
                console.log("renew success");

                // Open core application
                this.openCoreApp().then(() => {
                    setTimeout(() => {
                        app.quit();
                    }, 3000);
                })
            }).catch(err => {
                console.log("fail");
                console.log(err);
                this.window.webContents.send('login-error', err);
            })
        });

        ipcMain.on('append-log', (e, text) => {
            console.log(text);
        });
    }

    createWindow() {
        this.window = new BrowserWindow({width: 800, height: 600});

        // Load view
        this.window.loadURL('file://'+path.join(__dirname, 'view/main.html'));

        // Destroy window when closed
        this.window.on('closed', () => {
            this.window = null;
        });
    }

    openCoreApp() {
        return new Promise((resolve, reject) => {
            var result = '';
    
            switch(process.platform) {
                case 'darwin':
                    var child = exec(`open ${CORE_APP}.app`);
                    break;
                case 'win32':
                case 'win64':
                    var child = exec(`${CORE_APP}.exe`);
                case 'linux':
                    var child = exec(`${CORE_APP}.bin`);
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
}

module.exports = new MainWindow();