/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { File, FileRepository } from '@mypharma/api-core'

interface ImageCreateServiceDTO {
  url: string
  key: string
  name: string
  folder: string
}

class ImageCreateService {
  constructor(private repository?: any) { }

  public async imageCreate({ url, key, name, folder }: ImageCreateServiceDTO): Promise<File> {
    let file = new File()

    file.url = url
    file.key = key
    file.name = name
    file.folder = folder
    file._id = undefined
    file.updatedAt = new Date()
    file.createdAt = new Date()

    if (!this.repository) {

      file = await FileRepository.repo().createDoc(file)
    }

    return file
  }
}

export default ImageCreateService
