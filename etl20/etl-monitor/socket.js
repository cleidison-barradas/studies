// Socket IO Client
const io = require('socket.io-client');
const { Socket } = io;

// Utils
const logger = require('./utils/logger');
const { Color } = require('./utils/constants');

/**
 * Socket instance
 * 
 * @type {Socket}
 */
let socket;

module.exports =  {
  connect: (host, userId, token, coreVersion, appVersions) => {
    return new Promise((resolve) => {
      socket = io(host, {
        transports: ['websocket', 'polling'],
        query: {
          user_id: userId,
          token,
          coreVersion,
          appVersions
        }
      });
  
      // Error on connection to server?
      socket.on('connect_error', (data) => {
        const { description } = data;
        const { message } = description;
  
        logger('Could not connect to socket server!', Color.FgRed);
        logger(message);
      });
  
      // We are fully connected
      socket.on('connection_complete', () => {
        logger('Socket connected!', Color.FgGreen);
  
        resolve(socket);
      });
  
      // We are rejected?
      socket.on('socket_disconnect', (data) => {
        const { message, errorCode } = data;
  
        logger(`Socket disconnected! Reason: ${message}`, Color.FgMagenta);
        if (errorCode === 'invalid_session') {
          socket.close();
  
          setTimeout(() => {
            socket.connect();
          }, 500000);
        }
      })
    });
  },
  socket: () => socket
}
