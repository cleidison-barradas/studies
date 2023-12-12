/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { File, FileRepository } from '@mypharma/api-core'
import { ObjectId } from 'bson'

interface ImageGetByImageIdServiceDTO {
  imageId: string
}

class ImageGetByImageIdService {
  constructor(private repository?: any) { }

  public async getImageByImageId({ imageId }: ImageGetByImageIdServiceDTO): Promise<File> {
    let file = new File()
    const _id = new ObjectId(imageId)

    if (!this.repository) {

      file = await FileRepository.repo().findById(_id)
    }

    return file
  }
}

export default ImageGetByImageIdService