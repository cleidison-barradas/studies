import sharp from 'sharp'

export const ImageCompress = (file: Buffer, size: number): Promise<Buffer> => {
  const image = sharp(Buffer.from(String(file).replace(/^data:image\/\w+;base64,/, ''), 'base64'))
    .resize(size)
    .toFormat('webp')
    .webp({
      quality: 80,
    })
    .toBuffer()
    .then((data) => {
      return data
    })
  return image
}
