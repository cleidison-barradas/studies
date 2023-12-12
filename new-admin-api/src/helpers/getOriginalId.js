
/**
 *
 * @returns {number}
 */
const getOriginalId = () => {
  const now = new Date()
  const year = now.getFullYear()
  const mount = now.getMonth() + 1

  const originalId = `${year}${mount < 10 ? '0' : ''}${mount}${now.getHours()}${now.getMinutes()}${now.getSeconds()}`

  return originalId
}

module.exports = getOriginalId
