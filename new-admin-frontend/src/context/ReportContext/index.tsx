import React, { createContext } from 'react'
import { BaseContextState, BaseContextProvider } from '../BaseContext'
import { getReport, getiFoodReports } from '../../services/api'

import { BaseApi } from '../../config'
import { RequestReport } from '../../services/api/interfaces/ApiRequest'
import download from '../../helpers/download'
import { IFoodReport } from '../../interfaces/ifood'

interface ReportContextState extends BaseContextState {
  report: string | null
  ifoodReports: IFoodReport[]
}

interface ReportContextData extends ReportContextState {
  requestgetReport: (data: RequestReport) => Promise<void>
  requestiFoodReports: () => Promise<void>
}

// Create context
const context = createContext({} as ReportContextData)

const { Provider, Consumer } = context
// Export consumer
export const ReportConsumer = Consumer

export class ReportProvider extends BaseContextProvider {
  state: ReportContextState = {
    report: null,
    ifoodReports: []
  }

  requestgetReport = async (data: RequestReport) => {
    this.startRequest(BaseApi)

    const response = await getReport(data)

    if (response.ok) {
      download(response.data.report, 'relatorio')
      this.showMessage('Relatório gerado com sucesso!', 'success')
    }

    this.processResponse(response, ['report'])
  }

  getiFoodReports = async () => {
    this.startRequest(BaseApi)

    const response = await getiFoodReports()

    if(response.ok) {
      this.processResponse(response, ['ifoodReports'])
    }
  }

  render() {
    const { children } = this.props
    return (
      <Provider
        value={{
          ...this.state,
          requestgetReport: this.requestgetReport,
          requestiFoodReports: this.getiFoodReports
        }}
      >
        {children}
      </Provider>
    )
  }
}
