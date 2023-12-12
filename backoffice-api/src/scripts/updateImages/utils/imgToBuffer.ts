import sharp from 'sharp'
import * as fs from 'fs'
import { promisify } from 'util'

const imgToBuffer = async (path: string): Promise<Buffer> => {
  const stream = fs.createReadStream(path)
  const sharpInstance = sharp().png()

  stream.pipe(sharpInstance) // readable -> writeable

  const buffer = await promisify(sharpInstance.toBuffer).bind(sharpInstance)()

  return buffer
}

export { imgToBuffer }
