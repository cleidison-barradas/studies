import { createContext } from "react"
import Import from "../../interfaces/import"
import { BaseContextProvider, BaseContextState } from "../BaseContext"
import { importCustomers } from '../../services/api'
import { ImportApi } from "../../config"
import { RequestImportCustomer } from "../../services/api/interfaces/ApiRequest"
import SnackbarContext from '../SnackbarContext'

interface IUploadContextState extends BaseContextState {
  import: Import | null
}

interface IUploadContextData extends IUploadContextState {
  requestGetImports: (...args: any) => Promise<void>
  requestPostImportProdcuts: (...args: any) => Promise<void>
  requestPostImportCustomers: (...args: any) => Promise<void>
  requestPostImportPromotions: (...args: any) => Promise<void>
}

const UploadContext = createContext({} as IUploadContextData)

export default UploadContext

const { Provider, Consumer } = UploadContext

export const UploadContextConsumer = Consumer

export class UploadContextProvider extends BaseContextProvider {
  static contextType = SnackbarContext
  context!: React.ContextType<typeof SnackbarContext>

  state: IUploadContextState = {
    import: null
  }

  requestGetImports = async () => {
    // To do
  }
  requestPostImportProdcuts = async () => {
    // To do
  }

  requestPostImportCustomers = async (data: RequestImportCustomer) => {
    const form = new FormData()

    form.append('file', data.file)
    form.append('license', data.license)

    this.startRequest(ImportApi)
    const response = await importCustomers(form)

    if (response.ok) {
      this.showMessage('clientes importados com sucesso!', 'success')
    }
  }
  requestPostImportPromotions = async () => {
    // To do
  }

  render() {
    const { children } = this.props

    return (
      <Provider
        value={{
          ...this.state,
          requestGetImports: this.requestGetImports,
          requestPostImportProdcuts: this.requestPostImportProdcuts,
          requestPostImportCustomers: this.requestPostImportCustomers,
          requestPostImportPromotions: this.requestPostImportPromotions
        }}>
        {children}
      </Provider>
    )
  }
}