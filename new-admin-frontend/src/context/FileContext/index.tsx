import React, { createContext } from 'react'
import { BaseApi } from '../../config'
import { addFiles, deleteFiles, getMocks, updateMocks } from '../../services/api'
import { BaseContextProvider, BaseContextState } from '../BaseContext'
import File from '../../interfaces/file'
import Mockups from '../../interfaces/mockups'
import { RequestAddImage } from '../../services/api/interfaces/ApiRequest'

interface FileState extends BaseContextState {
  image: File | null
  mockups: Mockups | null
}

interface FileContextData extends FileState {
  requestAddImage: ({folder, file}:RequestAddImage) => Promise<File>
  requestDeleteImage: (...args: any) => void
  requestGetMocks: () => Promise<void>
  requestUpdateMocks: (data: Mockups) => Promise<void>
}

const FileContext = createContext({} as FileContextData)
export default FileContext

const { Consumer, Provider } = FileContext
export const FileConsumer = Consumer

export class FileProvider extends BaseContextProvider {
  state: FileState = {
    fetching: false,
    success: false,
    error: null,
    errorObjects: null,
    deletedId: null,
    image: null,
    mockups: null,
  }

  requestAddImage = async ({folder, file}:RequestAddImage) => {
    this.startRequest(BaseApi)
    const response = await addFiles({folder, file})
    this.processResponse(response, ['image'])
    return response.data
  }

  requestDeleteImage = async (id: string) => {
    this.startRequest(BaseApi)
    const response = await deleteFiles(id)
    this.processResponse(response, ['deletedId'])
  }

  requestGetMocks = async () => {
    this.startRequest(BaseApi)
    const response = await getMocks()
    this.processResponse(response, ['mockups'])
  }

  requestUpdateMocks = async (data: Mockups) => {
    this.startRequest(BaseApi)
    const response = await updateMocks(data)
    if (response.ok) {
      this.showMessage('Atualização efetuada com sucesso', 'success')
    }
    this.processResponse(response, [])
  }

  render() {
    const { children } = this.props
    return (
      <Provider
        value={{
          ...this.state,
          requestAddImage: this.requestAddImage,
          requestDeleteImage: this.requestDeleteImage,
          requestGetMocks: this.requestGetMocks,
          requestUpdateMocks: this.requestUpdateMocks,
        }}
      >
        {children}
      </Provider>
    )
  }
}
