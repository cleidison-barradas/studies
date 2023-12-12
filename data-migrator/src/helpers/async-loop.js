/**
 * Async for earch
 * 
 * @param {Array} array 
 * @param {Function} callback 
 */
module.exports = async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
