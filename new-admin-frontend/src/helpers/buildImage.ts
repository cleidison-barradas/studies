import { UploadImage } from "../interfaces/uploadFile"

const BuildImage = (img: UploadImage) => {
  return {
    name: img.name,
    size: img.size,
    type: img.type,
    content: undefined,
    url: '',
    key: '',
    folder: ''
  }
}
export default BuildImage
