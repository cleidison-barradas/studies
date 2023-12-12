const rdSync = require('readline-sync')
const converters = require('../../converters')

const execProcess = async () => {
  const index = rdSync.keyInSelect(converters.map(x => x.key().name), 'what do you want to do ?')

  if (index === -1) {
    process.exit(0)
  }

  const { handle } = converters[index]

  await handle()

  setTimeout(async () => {
    return await execProcess()
  }, 1500)
}

module.exports = execProcess
