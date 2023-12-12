const fs = require('fs');
const path = require('path');

/**
 * Async for earch
 * 
 * @param {Array} array 
 * @param {Function} callback 
 */
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

/**
 * Read directory and return full path of files
 * 
 * @param {String} folder 
 * @param {Array} blacklist
 * @return {Array}
 */
const scanDir = (folder, blacklist = []) => {
  return fs.readdirSync(folder).filter(file => blacklist.indexOf(file.toLowerCase()) === -1)
          .map(file => {
            return path.join(folder, file);
          });
}

/**
 * Read content of files
 * 
 * @param {Array} pathnames 
 * @return {Array}
 */
const readFiles = async (pathnames) => {
  const result = [];

  await asyncForEach(pathnames, async (p) => {
    const content = await fs.readFileSync(p, {encoding: 'UTF-8'});

    result.push({
      file: path.basename(p),
      content
    });
  });

  return result;
}

module.exports = {
  scanDir,
  readFiles
}
