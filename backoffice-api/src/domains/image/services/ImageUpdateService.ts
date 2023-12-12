/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { File, FileRepository, ObjectID } from '@mypharma/api-core'

interface ImageUpdateServiceDTO {
  file: File
}

class ImageUpdateService {
  constructor(private repository?: any) { }

  public async imageUpdate({ file }: ImageUpdateServiceDTO): Promise<File> {

    const _id = new ObjectID(file._id)
    delete file._id
    file.updatedAt = new Date()

    if (!this.repository) {

      await FileRepository.repo().updateOne({ _id }, { $set: { ...file } })
    }

    return FileRepository.repo().findById(_id)
  }
}

export default ImageUpdateService
