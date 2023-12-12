const fs = require('fs')
const ObjectsToCsv = require('objects-to-csv')
const path = require('path')

const name = 'eanChunks.csv'
const dir = path.resolve(__dirname, '..', '..', 'tmp', name)

const getFile = (fileName) => {
    return fs.readFileSync(fileName)
}

const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
          console.log(`error ${err}`)
          return false
        }
        return true
      })
}

async function sortAndWriteProducts(unOrdenedProducts) {
    if (unOrdenedProducts.length > 0) {
        let loadedData = Object.assign([], unOrdenedProducts)
        deleteFile(dir)
        
        do {
            const next = loadedData.sort((a, b) => b.rank - a.rank).slice(0, 1000)
            const csvFile = new ObjectsToCsv(next)
        
            await csvFile.toDisk(dir, { append: true })
            loadedData.splice(0, 1000)
        
        } while (loadedData.length > 0)
        
        const folder = path.resolve(__dirname, '..', '..', 'tmp', name)
        const file = fs.readFileSync(folder)
    }
}

module.exports = {sortAndWriteProducts}