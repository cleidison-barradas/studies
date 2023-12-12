import React, { createContext } from 'react'
import { BaseApi } from '../../config'
import { BaseContextProvider, BaseContextState } from '../BaseContext'
import { deleteLead, getLead, getLeads, updateLead, getLeadsReport } from '../../services/api/index'

import Lead from '../../interfaces/Lead'
import { GetLeadsRequest, LeadsReportRequest, PostLeadRequest } from '../../services/api/interfaces/ApiRequest'

import download from '../../helpers/download'

interface ContextState extends BaseContextState {
  leads: Lead[],
  lead?: Lead
  report: string | null
}

interface ContextData extends ContextState {
  getLead: (id: string) => Promise<void>
  getLeads: (data?: GetLeadsRequest) => Promise<void>
  deleteLead: (id: string) => Promise<void>
  updateLead: (data: PostLeadRequest) => Promise<void>
  getLeadsReport: (data: LeadsReportRequest) => Promise<void>
}

const context = createContext({} as ContextData)

const { Provider, Consumer } = context

export const LeadConsumer = Consumer

export class LeadProvider extends BaseContextProvider {
  state: ContextState = {
    leads: [],
    lead: {
      _id: '',
      name: '',
      storeName: '',
      cnpj: '',
      storePhone: '',
      ownerPhone: '',
      email: '',
      colaborator: '',
      colaboratorCpf: '',
      colaboratorCnpj: '',
      colaboratorEmail: '',
      colaboratorPhone: '',
      status: 'open',
      statusHistory: [],
      sdr: {
        name: '',
        email: '',
        willReceveLeadsEmail: true
      },
    },
    report: null
  }

  getLead = async (id: string) => {
    await this.startRequest(BaseApi)
    const res = await getLead(id)

    this.processResponse(res, ['lead'])
  }

  getLeads = async (data?: GetLeadsRequest) => {
    await this.startRequest(BaseApi)
    const res = await getLeads(data)

    this.processResponse(res, ['leads'])
  }

  updateLead = async (data: PostLeadRequest) => {
    await this.startRequest(BaseApi)
    const res = await updateLead(data)

    this.processResponse(res, ['lead'])

    if (res.ok) {
      this.showMessage('Lead atualizado com sucesso', 'success')
    }
  }

  deleteLead = async (id: string) => {
    await this.startRequest(BaseApi)

    const res = await deleteLead(id)

    this.processResponse(res, [])

    if (res.ok) {
      this.showMessage('Lead deletado com sucesso!', 'success')
    }
  }

  getLeadsReport = async (data: LeadsReportRequest) => {
    this.startRequest(BaseApi)

    const response = await getLeadsReport(data)

    if (response.ok) {
      download(response.data.report, 'relatorio')
      this.showMessage('Relatório gerado com sucesso!', 'success')
    } else if (!response.ok && response.data.error === 'not_have_leads_with_these_proprieties') {
      this.showMessage('Não há leads com os filtros selecionados', 'error')
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
          getLead: this.getLead,
          getLeads: this.getLeads,
          deleteLead: this.deleteLead,
          getLeadsReport: this.getLeadsReport,
          updateLead: this.updateLead
        }}
      >
        {children}
      </ Provider>
    )
  }
}
