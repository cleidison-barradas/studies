const psNode = require('ps-node');

/**
 * Kill process by PID
 * 
 * @param {String} pid
 * @return {Promise<Boolean>}
 */
module.exports = (pid) => {
  return new Promise((resolve, reject) => {
    psNode.kill(pid, (err) => {
      if (err) reject(err);
      else resolve(true);
    })
  });
}
