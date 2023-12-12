import path from 'path'
import { Request } from 'express'
import { randomBytes } from 'crypto'
import { diskStorage, FileFilterCallback } from 'multer'

const acceptFiles: string[] = ['.xls', '.xlsx', 'application/vnd.ms-excel']

const storageTypes = {
  local: diskStorage({
    destination: path.resolve(__dirname, '..', 'tmp'),
    filename: (req, file, callback) => {
      randomBytes(16, (error, hash) => {
        if (error) callback(error, null)

        return callback(null, `${hash.toString('hex')}-${file.originalname}`)
      })
    },
  })
}

const fileFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {

  if (acceptFiles.includes(file.mimetype)) {
    callback(null, true)

  } else {
    callback(new Error('invalid_file_type'))

  }
}
export default {
  storage: storageTypes.local,
  fileFilter
}