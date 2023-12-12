import React, { createContext } from 'react'
import { BaseApi } from '../../config'
import download from '../../helpers/download'
import { getGMVReport, getStoresReport, removeCpfIndexes, updateStoreProductsControl } from '../../services/api'
import { PostUpdateStoreProductsControlRequest, RequestGMVReport, RequestStoresReport } from '../../services/api/interfaces/ApiRequest'
import { BaseContextProvider, BaseContextState } from '../BaseContext'

interface ReportContextState extends BaseContextState {
  report: string | null
}

interface ReportContextData extends ReportContextState {
  requestGetReport: (data: RequestStoresReport) => Promise<void>
  removeCpfIndexes: () => Promise<void>
  updateStoreProductsControl: (data: PostUpdateStoreProductsControlRequest) => Promise<void>
  requestGMVReport: (data: RequestGMVReport) => Promise<void>
}

const context = createContext({} as ReportContextData)

const { Provider, Consumer } = context

export const ReportConsumer = Consumer

export class ReportProvider extends BaseContextProvider {
  state: ReportContextState = {
    report: null
  }

  requestGetReport = async (data: RequestStoresReport) => {
    this.startRequest(BaseApi)

    const response = await getStoresReport(data)

    if (response.ok) {
      download(response.data.report, 'relatorio')
      this.showMessage('Relatório gerado com sucesso!', 'success')
    } else if (!response.ok && response.data.error === 'not_have_stores_with_these_proprieties') {
      this.showMessage('Não há lojas com os filtros selecionados', 'error')
    } else {
      this.showMessage('Erro ao gerar o relatório', 'error')
    }

    this.processResponse(response, ['report'])
  }

  removeCpfIndexes = async () => {
    this.startRequest(BaseApi)
    const response = await removeCpfIndexes()
    this.processResponse(response, ['store'])
}

  updateStoreProductsControl = async (data: PostUpdateStoreProductsControlRequest) => {
    this.startRequest(BaseApi)
    const response = await updateStoreProductsControl(data)
    this.processResponse(response, [])
  }

requestGMVReport = async (data: RequestGMVReport) => {

  this.startRequest(BaseApi)

  console.log(data.startDate, data.endDate)

  const response = await getGMVReport(data)

  this.processResponse(response, ['report'])
}

  render() {
    const { children } = this.props
    return (
      <Provider
        value={{
          ...this.state,
          requestGetReport: this.requestGetReport,
          removeCpfIndexes: this.removeCpfIndexes,
          requestGMVReport: this.requestGMVReport,
          updateStoreProductsControl: this.updateStoreProductsControl
        }}
      >
        {children}
      </Provider>
    )
  }
}
