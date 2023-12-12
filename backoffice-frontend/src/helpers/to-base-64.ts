/* eslint-disable import/no-anonymous-default-export */
import { isArray } from 'lodash'

export default (files: any): Promise<any> => {
  if (isArray(files)) {
    const promises = files.map((file: any) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })
    })
    return Promise.all(promises)
  } else {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(files)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }
}
