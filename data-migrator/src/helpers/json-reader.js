const fs = require('fs')
const path = require('path')

/**
 * Read a JSON file
 * 
 * @param {String} path
 * @returns {Object}
 * @throws {Error}
 */
module.exports = async (filePath) => {
  try {
    const content = await fs.readFileSync(path.join(__dirname, '../', filePath))
    return JSON.parse(content)
  } catch (error) {
    throw new Error('Could not read JSON file. ' + error.message)
  }
}
