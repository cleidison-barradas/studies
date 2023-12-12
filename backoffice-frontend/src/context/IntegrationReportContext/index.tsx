import React, { createContext } from 'react'
import { BaseApi } from '../../config'
import download from '../../helpers/download'
import { getIntegrationsReport } from '../../services/api'
import { IntegrationStoresReport } from '../../services/api/interfaces/ApiRequest'
import { BaseContextProvider, BaseContextState } from '../BaseContext'

interface IntegrationReportContextState extends BaseContextState {
  report: string | null
}

interface IntegrationReportContextData extends IntegrationReportContextState {
  getIntegrationsReport: (data: IntegrationStoresReport) => Promise<void>
}

const context = createContext({} as IntegrationReportContextData)

const { Provider, Consumer } = context

export const IntegrationReportConsumer = Consumer

export class IntegrationReportProvider extends BaseContextProvider {
  state: IntegrationReportContextState = {
    report: null
  }

  getIntegrationsReport = async (data: IntegrationStoresReport) => {
    this.startRequest(BaseApi)

    const response = await getIntegrationsReport(data)

    if (response.ok) {
      download(response.data.report, 'relatorio')
      this.showMessage('Relatório gerado com sucesso!', 'success')
    } else if (!response.ok && response.data.error === 'not_have_integrations_with_these_proprieties') {
      this.showMessage('Não há integrações com os filtros selecionados', 'error')
    } else {
      this.showMessage('Erro ao gerar o relatório', 'error')
    }

    this.processResponse(response, ['report'])
  }

  render() {
    const { children } = this.props
    return (
      <Provider
        value={{
          ...this.state,
          getIntegrationsReport: this.getIntegrationsReport,
        }}
      >
        {children}
      </Provider>
    )
  }
}
