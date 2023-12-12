import React, { createContext } from 'react'
import { BaseContextProvider, BaseContextState } from '../BaseContext'
import SnackbarContext from '../SnackbarContext'
import { BaseApi, XlsImportApi, ImportApi } from '../../config'
import io from 'socket.io-client'
import { loadStorage } from '../../services/storage'
import { deleteImports, getImports, getImportHistory, putImportPromotions, putImportProducts, deleteImportProducts } from '../../services/api'
import Import from '../../interfaces/import'
import ImportHistory from '../../interfaces/importHistory'
import { PutImportProduct, PutImportPromotion } from '../../services/api/interfaces/ApiRequest'
import STORAGE_KEYS from '../../services/storageKeys'
import { IStorageTenant } from '../../interfaces/storageTenant'
import { IUser } from '../../interfaces/user'

// eslint-disable-next-line
// import ss from 'socket.io-stream'

interface XlsImportsContextState extends BaseContextState {
  imports: Import[]
  import: Import | null
  connected: boolean
  importing?: any
  importHistory: ImportHistory[]
  history: ImportHistory | null
  ok: boolean
}

interface XlsImportsContextData extends XlsImportsContextState {
  send: (...args: any) => void
  getImports: (...args: any) => void
  deleteImports: (...args: any) => void
  clearImporting: (...args: any) => void
  requestGetImportHistory: (...args: any) => void
  requestPutImportPromotions: (...args: any) => void
  requestPutImportProducts: (...args: any) => void
  requestDeleteProductsImported: (...args: any) => void
}

const xlsImportContext = createContext({} as XlsImportsContextData)
export default xlsImportContext

const { Consumer, Provider } = xlsImportContext
export const XlsImportConsumer = Consumer

export class XlsImportProvider extends BaseContextProvider {
  static contextType = SnackbarContext
  context!: React.ContextType<typeof SnackbarContext>

  private socket: any = undefined

  state: XlsImportsContextState = {
    fetching: false,
    success: false,
    error: null,
    errorObjects: null,
    deletedId: null,
    pagination: null,
    imports: [],
    connected: false,
    importing: null,
    import: null,
    importHistory: [],
    history: null,
    ok: false
  }

  constructor(props: any) {
    super(props)

    const tenant = loadStorage<IStorageTenant>(STORAGE_KEYS.TENANT_KEY)
    const user = loadStorage<IUser>(STORAGE_KEYS.USER_KEY)

    if (user && tenant) {
      this.socket = io(XlsImportApi, {
        query: {
          user_id: user._id,
          tenant: tenant._id,
        },
        transports: ['websocket', 'polling'],
      })
      this.events(this.socket)
    }

    this.send = this.send.bind(this)
    this.events = this.events.bind(this)
    this.clearImporting = this.clearImporting.bind(this)
  }

  events(socket: any) {
    socket.on('connect', () => {
      this.setState(
        {
          ...this.state,
          connected: true,
          importing: null,
        },
        async () => {
          await this.getImports()
        }
      )
    })

    socket.on('disconnect', () => {
      this.setState({
        ...this.state,
        connected: false,
      })
    })

    socket.on('feedback', (importing: any) => {
      this.setState({
        ...this.state,
        importing,
      })
    })

    socket.on('upload_finished', async (importing: any) => {
      await this.getImports()
      this.setState({
        ...this.state,
        importing,
      })
    })

    socket.on('inProgress', (data: any) => {
      this.setState({
        ...this.state,
        importing: data,
      })
    })

    socket.on('errorOnUpload', (error: any) => {
      this.setState({
        ...this.state,
        error,
      })
    })
  }

  deleteImports = async (ids: Import['_id'][]) => {
    this.startRequest(XlsImportApi)
    const response = await deleteImports({ ids })
    this.processResponse(response)
  }

  getImports = async (data?: any, id?: string) => {
    this.startRequest(XlsImportApi)
    const response = await getImports(data, id)
    this.processResponse(response, ['imports', 'import'])
  }

  clearImporting() {
    this.setState({
      ...this.state,
      importing: null,
      error: null,
    })
  }

  send(data: any) {
    this.socket.emit('upload', data)
  }

  componentWillUnmount() {
    this.socket.disconnect()
  }

  requestGetImportHistory = async (id?: string, data?: any) => {
    this.startRequest(BaseApi)

    const response = await getImportHistory(id, data)
    this.processResponse(response, ['importHistory', 'history'])
  }

  requestPutImportPromotions = async (data: PutImportPromotion) => {
    this.startRequest(ImportApi)
    const form = new FormData()

    form.append('promotions', data.file)
    form.append('date_start', data.date_start.toString())
    form.append('date_end', data.date_end.toString())

    const response = await putImportPromotions(form)
    this.processResponse(response, ['ok'])
  }
  requestPutImportProducts = async (data: PutImportProduct) => {
    this.startRequest(ImportApi)
    const form = new FormData()
    form.append('products', data.file)

    const response = await putImportProducts(form)
    this.processResponse(response)
  }

  requestDeleteProductsImported = async (id: string) => {
    this.startRequest(BaseApi)
    const response = await deleteImportProducts(id)
    this.processResponse(response, ['deletedId'])
  }

  render() {
    const { children } = this.props
    return (
      <Provider
        value={{
          ...this.state,
          send: this.send,
          getImports: this.getImports,
          deleteImports: this.deleteImports,
          clearImporting: this.clearImporting,
          requestGetImportHistory: this.requestGetImportHistory,
          requestPutImportProducts: this.requestPutImportProducts,
          requestPutImportPromotions: this.requestPutImportPromotions,
          requestDeleteProductsImported: this.requestDeleteProductsImported
        }}
      >
        {children}
      </Provider>
    )
  }
}
