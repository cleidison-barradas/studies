const { exec } = require('child_process');

/**
 * Start a new process
 * 
 * @param {String} pathname
 * @return {Promise}
 */
module.exports = (pathname) => {
  return new Promise((resolve, reject) => {
    switch (process.platform) {
      case 'darwin':
        var child = exec(`open ${pathname}.app`);
        break;
      case 'win32':
      case 'win64':
        var child = exec(`${pathname}.exe`);
      case 'linux':
        var child = exec(`${pathname}.bin`);
        break;
    }

    child.on('error', (err) => {
      reject(err);
    });

    child.on('exit', () => {
      resolve(true);
    });
  })
}
