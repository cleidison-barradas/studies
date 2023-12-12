const Sequelize = require('sequelize');
const Firebird = require('firebird-limber')
const Tedious = require('tedious');
const { Dbf } = require('dbf-reader');
const pg = require('pg');
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
const ftp = require('basic-ftp');

// MomentJS
const moment = require('moment');

var oracledb = null;

const Configuration = require('../config.json');

// Helpers
const dbfRecordsParser = require('./helpers/dbf.parser')

// Logging
const logging = require('./logging');

class Database {
    constructor() {
        this.config = undefined;
        this.ftp = undefined;
    }

    init(config) {
        this.config = config;

        return new Promise((resolve, reject) => {
            const { host, port, name, user, password, dialect } = this.config;

            if (dialect === 'mysql') {
                this.database = new Sequelize({
                    host: host,
                    port: port ? Number(port) : 3306,
                    database: name,
                    username: user,
                    password: password,
                    dialect: dialect,
                    operatorsAliases: false,
                    insecureAuth: true,
                    dialectOptions: {
                        connectTimeout: 60000
                    },
                    logging: (text) => {
                        logging('database', text);
                    }
                });

                this.database.authenticate().then(() => {
                    resolve(true);
                }).catch(err => {
                    reject(err);
                });
            }
            else if (dialect === 'postgres') {
                this.database = new pg.Client({
                    host: host,
                    port: port ? Number(port) : 3306,
                    user: user,
                    password: password,
                    database: name
                });

                this.database.connect().then(() => {
                    resolve(true);
                }).catch(err => {
                    reject(err);
                });
            }
            else if (dialect === 'mysql4') {
                this.database = mysql.createConnection({
                    host: host,
                    port: port ? Number(port) : 3306,
                    database: name,
                    user: user,
                    password: password
                });

                // Test connection
                this.database.connect((err) => {
                    if (err) reject(err);
                    else resolve(true);
                });
            }
            else if (dialect === 'mysql-insecure') {
                this.database = mysql.createConnection({
                    host: host,
                    port: port ? Number(port) : 3306,
                    database: name,
                    user: user,
                    password: password,
                    insecureAuth: true
                });

                // Test connection
                this.database.connect((err) => {
                    if (err) reject(err);
                    else resolve(true);
                });
            }
            else if (dialect === 'mssql') {
                // Debugging
                this.database = new Tedious.Connection({
                    server: host,
                    options: {
                        port: Number(port),
                        database: name,
                        encrypt: false,
                        //trustServerCertificate: true
                    },
                    authentication: {
                        type: 'default',
                        options: {
                            userName: user,
                            password: password
                        }
                    }
                });

                this.database.on('connect', (err) => {
                    if (!err) resolve(true);
                    else {
                        logging('database', err.message);

                        reject(err);
                    }
                });
            }
            else if (dialect === 'oracledb') {
                if (process.arch !== 'x64') {
                    reject('OracleDB connection is only supported on x64 systems.');
                } else {

                    oracledb = require('oracledb');

                    oracledb.getConnection({
                        user,
                        password,
                        connectString: `${host}:${port}/${name}`
                    }).then(connection => {
                        this.database = connection;

                        resolve(true);
                    }, err => {
                        reject(err.message || err);
                    });
                }
            }
            else if (dialect === 'firebird') {
                this.firebirdOptions = {
                    host: host,
                    port: port,
                    user: user,
                    database: name,
                    password: password,
                    //role: 'SYSDBA'
                };

                logging('database', 'Attching to Firebird...');

                Firebird.attach(this.firebirdOptions, (err, db) => {
                    if (err) {
                        logging('database', 'Failed to attach Firebird!');
                        logging('database', err.message);

                        reject(err);
                    }
                    else {
                        logging('database', 'Successfully attached to Firebird!');

                        db.detach();
                        resolve(true);
                    }
                })
            }
            else if (dialect === 'txt') {
                this.txtLocation = name;
                resolve(true);
            }
            else if (dialect === 'dbf') {
                try {
                    const fileBuffer = fs.readFileSync(name)
                    const data = Dbf.read(fileBuffer)

                    if (!data) {
                        reject('cannot ready dbf file')
                    }
                    this.database = data.rows

                    resolve(true)

                } catch (error) {
                    reject(error)
                }
            }
            else if (dialect === 'ftp') {
                this.ftpClient = new ftp.Client();
                this.ftpOptions = {
                    host: host,
                    port: 21,
                    user: user,
                    password: password,
                    secure: false
                };

                // Test connection
                this.ftpClient.access(this.ftpOptions).then(() => {
                    this.ftpClient.close();

                    resolve(true);
                }).catch(err => {
                    this.ftpClient.close();

                    reject(err);
                });
            }
            else {
                reject('Unsupported database!');
            }
        })
    }

    stringify(value = '') {
        if (Buffer.isBuffer(value)) {
            return String(value).toString().trimEnd()
        }
        return value
    }

    query(sql) {
        return new Promise((resolve, reject) => {
            const startTime = moment();

            if (this.config.dialect === 'firebird') {

                Firebird.attach(this.firebirdOptions, (err, db) => {

                    if (err) {
                        logging('database', err.message);
                        reject(err);
                    } else {
                        // Make query
                        db.query(sql, (error, result) => {
                            if (error) {
                                logging('database', error.message);
                                reject(error);
                            }
                            else {
                                const diff = moment().diff(startTime);
                                const dur = moment.duration(diff);
                                logging('database', 'Query took: ' + dur.humanize());
                                let rows = []
                                if (result.length) {
                                    logging('database', 'Query total result: ' + result.length);
                                    logging('database', 'Query result example: ' + JSON.stringify(result[0]));

                                    rows = result.map(row => {
                                        let obj = {}
                                        Object.keys(row).forEach(key => {
                                            obj = {
                                                ...obj,
                                                [key]: this.stringify(row[key])
                                            }
                                        })
                                        return obj
                                    })
                                }

                                db.detach();
                                resolve(rows);
                            }
                        });
                    }
                });
            }
            else if (this.config.dialect === 'txt') {
                fs.readFile(this.txtLocation, { encoding: 'utf-8' }, (err, data) => {
                    if (err) reject(err);
                    else {
                        const result = [];
                        const lines = data.split('\r\n');

                        lines.forEach(row => {
                            const col = row.split(';');


                            if (col.length === 8) {
                                const ean = col[2];
                                const name = col[3];
                                const presentation = col[4];
                                const price = col[6];
                                const quantity = col[7];

                                result.push({ ean, name, presentation, price, quantity });
                            }

                            if (col.length === 7) {
                                const ean = String(col[0]).trim()
                                const name = String(col[1]).trim()
                                const quantity = col[2];
                                const laboratory = String(col[3]).trim()
                                const price = Number(String(col[4]).trim().replace(/\,/, '.'))
                                const erp_pmc = Number(String(col[5]).trim().replace(/\,/, '.'))

                                result.push({ ean, name, laboratory, price, erp_pmc, quantity });
                            }
                        });

                        resolve(result);
                    }
                })
            }
            else if (this.config.dialect === 'dbf') {
                try {
                    const erpName = this.config.erpName;

                    const result = this.database.map(record => dbfRecordsParser(record, erpName));

                    resolve(result)

                } catch (error) {
                    reject(error)
                }
            }
            else if (this.config.dialect === 'ftp') {
                const { installation_folder } = Configuration;

                this.ftpClient = new ftp.Client();
                this.ftpClient.prepareTransfer = ftp.enterPassiveModeIPv4;
                this.ftpClient.access(this.ftpOptions).then(async () => {
                    try {
                        const files = await this.ftpClient.list();
                        const fileExists = files.find(p => p.name === 'products.txt');

                        if (!fileExists) reject('FTP file not found.');
                        else {
                            // Create output directory if not exists
                            const outputPath = path.join(installation_folder, 'download');
                            if (!fs.existsSync(outputPath)) {
                                fs.mkdirSync(outputPath);
                            }

                            // Download file
                            await this.ftpClient.downloadTo(path.join(outputPath, 'products.txt'), 'products.txt');

                            // Read file
                            fs.readFile(path.join(installation_folder, 'download', 'products.txt'), { encoding: 'utf-8' }, (err, data) => {
                                if (err) reject(err);
                                else {
                                    const result = [];
                                    const lines = data.split('\n');
                                    lines.forEach(row => {
                                        const col = row.split(';');
                                        if (col.length === 8) {
                                            const ean = col[2];
                                            const name = col[3];
                                            const presentation = col[4];
                                            const price = col[6];
                                            const quantity = col[7];

                                            result.push({ ean, name, presentation, price, quantity });
                                        }
                                    });
                                    resolve(result);
                                }
                            });
                        }

                        // Close connection
                        this.ftpClient.close();
                    } catch (error) {
                        // Close connection
                        this.ftpClient.close();

                        reject(error);
                    }

                }, (err) => {
                    reject(err);
                });
            }
            else if (this.config.dialect === 'mssql') {
                const request = new Tedious.Request(sql, (err) => {
                    if (err) reject(err);
                })

                let result = [];

                request.on('row', (columns) => {
                    let bulkRow = {};

                    columns.forEach(col => {
                        const { value, metadata } = col;
                        const { colName } = metadata;

                        bulkRow[colName] = value;
                    });

                    result.push(bulkRow);
                });

                request.on('error', (err) => {
                    reject(err);
                });

                request.on('requestCompleted', () => {
                    resolve(result)
                });

                this.database.execSql(request)
            }
            else if (this.config.dialect === 'mysql4') {
                this.database.query(sql, (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            }
            else if (this.config.dialect === 'oracledb') {
                this.database.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT }).then(result => {
                    resolve(result.rows);
                }, err => {
                    reject(err);
                });
            }
            else if (this.config.dialect === 'postgres') {
                this.database.query(sql).then(result => {
                    resolve(result.rows);
                }, err => {
                    reject(err);
                })
            }

            // Default ORM query
            else {
                this.database.query(sql).then(result => {
                    resolve(result[0] || []);
                }, err => {
                    logging('database', err)
                    reject(err);
                })
            }
        })

    }
}

module.exports = new Database();