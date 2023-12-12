/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { File, FileRepository } from '@mypharma/api-core'

interface ImageGetByKeyServiceDTO {
  key: string
}

class ImageGetByKeyService {
  constructor(private repository?: any) { }

  public async getImageByKey({ key }: ImageGetByKeyServiceDTO): Promise<File> {

    return FileRepository.repo().findOne({
      where: {
        key
      }
    })
  }
}

export default ImageGetByKeyService
