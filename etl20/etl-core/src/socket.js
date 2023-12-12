const io = require('socket.io-client');
const crypto = require('crypto');
const uuidv4 = require('uuid/v4');

// Application
const { app } = require('electron');

// Database
const sqlite = require('./sqlite');

// Utils
const logger = require('./utils/logger');
const { Color } = require('./utils/constants');

/**
 * Encrypt Error Exception
 */
class EncryptError extends Error {
    constructor(message, code) {
        super(message);

        this.code = code;
        this.name = 'EncryptError';
    }
}

class Socket {
    constructor() {
        this.connected = false;

        // Send encrypted data queue
        this.sendQueue = [];

        // Last data buffer
        this.lastDataBuffer = undefined;

        // Process queue timer handler
        this.processQueueTimer = undefined;

        this.handlers = [];
    }

    init(host, userId, token, version) {
        return new Promise((resolve) => {
            this.socket = io(host, {
                transports: ['websocket', 'polling'],
                reconnectionDelay: 10000,
                reconnectionDelayMax: 50000,
                query: {
                    encrypted: false,
                    user_id: userId,
                    token,
                    version
                }
            });

            // Error on connecting to socket server
            this.socket.on('connect_error', (data) => {
                const { description } = data;
                const { message } = description;
                this.connected = false;

                logger('Could not connect to socket server!', Color.FgRed);
                logger(message);
            });

            // We are fully connected to socket server
            this.socket.on('connection_complete', () => {
                this.connected = true;

                logger('Socket connected!', Color.FgGreen);

                // Bind events
                this.events();

                // Process all data in queue
                this.processQueue();

                // Fire connected event to app
                const connectedEvent = this.handlers['connected'];
                if (connectedEvent !== undefined) {
                    connectedEvent(true);
                }
                resolve(true);
            });

            // We are rejected? \o/
            this.socket.on('socket_disconnect', (data) => {
                const { message, errorCode } = data;
                this.connected = false;

                logger(`Socket disconnected! Reason: ${message}`, Color.FgMagenta);
                if (errorCode === 102) {
                    setTimeout(() => {
                        app.quit();
                    }, 1000);
                }
            });
        })
    }

    events() {
        this.socket.off('disconnect');
        this.socket.on('disconnect', (reason) => {
            this.connected = false;

            logger(`Socket disconnected! Reason: ${reason}`, Color.FgMagenta);
        });

        this.socket.off('reconnect_attempt');
        this.socket.on('reconnect_attempt', (attemptNumber) => {
            logger(`Socket reconnecting (${attemptNumber})...`);
        });

        this.socket.on('data_received', (uid) => {
            const index = this.sendQueue.findIndex(p => p.uid === uid);

            if (index >= 0) {
                let { data } = this.sendQueue[index];

                this.sendQueue[index].data.splice(0, 1);

                if (data.length === 0) {
                    this.sendQueue.splice(index, 1);
                }
            }

            this.processQueue()
        });

        this.socket.off('data_integrity_failed');
        this.socket.on('data_integrity_failed', (uid) => {
            if (this.lastDataBuffer !== undefined) {
                // Remove invalidate queue
                const index = this.sendQueue.findIndex(p => p.uid === uid);
                if (index >= 0) {
                    this.sendQueue.splice(index, 1);
                }

                // Readd data to queue
                let data = [];
                this.lastDataBuffer.forEach((chunk, index) => {
                    data.push({
                        length: this.lastDataBuffer.length,
                        index,
                        chunk
                    });
                });

                this.sendQueue.push({
                    uid: uuidv4(),
                    data
                });

                logger('Failed to send data, Resending...', Color.FgMagenta);
            }
        });

        this.socket.off('data');
        this.socket.on('data', (data, fn) => {
            const decryptPromises = [];
            data.forEach(str => {
                decryptPromises.push(this.decrypt(str));
            });

            Promise.all(decryptPromises).then(result => {
                result = result.filter(p => p !== undefined);

                if (result.length === decryptPromises.length) {
                    let jsonStr = '';
                    result.forEach(decrypted => {
                        jsonStr += decrypted;
                    });

                    try {
                        const { event, data } = JSON.parse(jsonStr);

                        if (event !== undefined) {
                            const handler = this.handlers[event];

                            if (handler !== undefined) {
                                handler(data);
                            }

                            if (typeof fn === 'function') {
                                fn(true);
                            }
                        }
                    } catch (error) {
                        logger('ENCRYPTED: Invalid JSON format!', Color.FgRed);
                    }
                } else {
                    logger('Invalid encrypted data!', Color.FgRed);
                }
            });
        });

        // Receive our plain text data
        this.socket.off('data_plain');
        this.socket.on('data_plain', (receivedData, fn) => {
            if (typeof fn === 'function') {
                fn(true);
            }

            if (!receivedData) {
                return
            }

            let jsonStr = '';
            receivedData.forEach(str => {
                jsonStr += str;
            });

            try {
                const { event, data } = JSON.parse(jsonStr);

                if (event !== undefined) {
                    const handler = this.handlers[event];

                    if (handler !== undefined) {
                        handler(data);
                    }
                }
            } catch (error) {
                logger(error.message);
                logger('PLAIN TEXT: Invalid JSON format!', Color.FgRed);
                logger(data);
            }
        });
    }

    on(event, handler) {
        this.handlers[event] = handler;
    }

    off(event) {
        this.handlers[event] = undefined;
    }

    /**
     * Send plain text data
     * 
     * @param {Object} sendData 
     */
    send(sendData) {
        let dataParsed = JSON.stringify(sendData);
        const result = [];

        // Let's create blocks of our data, to enable easily encryption
        // Our blocks can't have more than 10k len
        if (dataParsed.length > (1000 * 10)) {
            while (dataParsed.length > 0) {
                const size = dataParsed.length > (1000 * 10) ? (1000 * 10) : dataParsed.length;

                result.push(dataParsed.slice(0, size));
                dataParsed = dataParsed.slice(size, dataParsed.length);
            }
        } else {
            result.push(dataParsed);
        }

        // Generate an unique id for the whole chunks of this data
        const uid = uuidv4();

        // Mount our queue :P
        const data = [];
        result.forEach((chunk, index) => {
            data.push({
                length: result.length,
                index,
                chunk
            });
        });

        this.sendQueue.push({
            uid,
            data
        });

        return data.length;
    }


    /**
     * Send encrypted data
     * 
     * DEPRECATED
     * DEPRECATED
     * DEPRECATED
     * 
     * @param {Object} sendData 
     */
    async __send(sendData) {
        try {
            let buffer = [];
            let dataParsed = JSON.stringify(sendData);

            // Let's create blocks of our data, to enable easily encryption
            // Our blocks can't have more than 128 len
            if (dataParsed.length > 128) {
                while (dataParsed.length > 0) {
                    const size = dataParsed.length > 128 ? 128 : dataParsed.length;

                    buffer.push(this.encrypt(dataParsed.slice(0, size)));

                    dataParsed = dataParsed.slice(size, dataParsed.length);
                }
            } else {
                buffer = [this.encrypt(dataParsed)];
            }

            const result = await Promise.all(buffer);

            const uid = uuidv4();
            this.lastDataBuffer = result;

            let data = [];
            result.forEach((chunk, index) => {
                data.push({
                    length: result.length,
                    index,
                    chunk
                });
            });

            this.sendQueue.push({
                uid,
                data
            });

            return data.length;
        } catch (error) {
            if (error && typeof error.code === 'string') {
                if (error.code.toLowerCase().includes('ssl')) {
                    throw new EncryptError('Encrypt keys are not valid', 'invalid_encrypt_keys');
                } else {
                    throw error;
                }
            } else throw error;
        }
    }

    /**
     * Process encrypted data queue and send chunk of it
     * 
     * DEPRECATED
     * DEPRECATED
     * DEPRECATED
     * 
     */
    __processQueue() {
        if (this.connected) {
            if (this.sendQueue.length > 0) {
                const queue = this.sendQueue[0];
                const { data } = queue;
                const { length, index, chunk } = data[0];

                this.socket.emit('data', {
                    uid: queue.uid,
                    length,
                    index,
                    chunk
                });
            }

            // Clear timer if already exists
            if (this.processQueueTimer !== undefined) {
                clearTimeout(this.processQueueTimer);
                this.processQueueTimer = undefined;
            }

            this.processQueueTimer = setTimeout(() => {
                this.processQueueTimer = undefined;

                this.processQueue();
            }, 5000);
        } else {
            logger('Socket no connected!');
        }
    }

    /**
     * Process plain text data to be send as chunk
     */
    processQueue() {
        if (this.connected) {
            if (this.sendQueue.length > 0) {
                const queue = this.sendQueue[0];
                const { data } = queue;
                const { length, index, chunk } = data[0];

                this.socket.emit('data_plain', {
                    uid: queue.uid,
                    length,
                    index,
                    chunk
                });
            }

            // Clear timer if already exists
            if (this.processQueueTimer !== undefined) {
                clearTimeout(this.processQueueTimer);
                this.processQueueTimer = undefined;
            }

            this.processQueueTimer = setTimeout(() => {
                this.processQueueTimer = undefined;

                this.processQueue();
            }, 5000);
        } else {
            logger('Socket not connected!');
        }
    }

    encrypt(data) {
        return sqlite.account.findAll().then(result => {
            const account = result[0];
            const { publicKey } = account;

            let buffer = Buffer.from(data);
            let encrypted = crypto.publicEncrypt(publicKey, buffer);
            /*let encrypted = crypto.publicEncrypt({
                key: publicKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
            }, buffer);*/

            return encrypted.toString('base64')
        });
    }

    decrypt(data) {
        return sqlite.account.findAll().then(result => {
            const account = result[0];
            const { publicKey } = account;

            let buffer = Buffer.from(data, 'base64');
            let decrypted = crypto.publicDecrypt(publicKey, buffer);
            /*let decrypted = crypto.publicDecrypt({
                key: publicKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
            }, buffer);*/

            return decrypted.toString('utf8');
        });
    }
}

module.exports = new Socket();
