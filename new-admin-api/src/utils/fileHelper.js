const sharp = require('sharp')

module.exports = (file, size, quality = 100) => {
    const fileCopy = file
    const { width, height } = size
    return sharp(new Buffer.from(fileCopy.replace(/^data:image\/\w+;base64,/, ''), 'base64'))
        .resize(width, height, { fit: 'contain', position: 'center', background: 'transparent' })
        .toFormat('webp')
        .webp({
            quality,
        })
        .toBuffer()
        .then((data) => {
            return data
        })
}
