import React, { createContext } from 'react'
import { BaseApi } from '../../config'
import { BaseContextProvider, BaseContextState } from '../BaseContext'
import { deleteSDR, getSDR, getSDRs, postSDR, updateSDR } from '../../services/api/index'

import SDR from '../../interfaces/SDR'
import { GetSDRsRequest, PostSDRRequest } from '../../services/api/interfaces/ApiRequest'

interface ContextState extends BaseContextState {
  sdrs: SDR[],
  sdr?: SDR
}

interface ContextData extends ContextState {
  getSDR: (id: string) => Promise<void>
  getSDRs: (data?: GetSDRsRequest) => Promise<void>
  postSDR: (data: PostSDRRequest) => Promise<void>
  updateSDR: (data: PostSDRRequest) => Promise<void>
  deleteSDR: (id: string) => Promise<void>
}

const context = createContext({} as ContextData)

const { Provider, Consumer } = context

export const SDRConsumer = Consumer

export class SDRProvider extends BaseContextProvider {
  state: ContextState = {
    sdrs: [],
  }

  getSDR = async (id: string) => {
    await this.startRequest(BaseApi)
    const res = await getSDR(id)

    this.processResponse(res, ['sdr'])
  }

  getSDRs = async (data?: GetSDRsRequest) => {
    await this.startRequest(BaseApi)
    const res = await getSDRs(data)

    this.processResponse(res, ['sdrs'])
  }

  postSDR = async (data: PostSDRRequest) => {
    await this.startRequest(BaseApi)
    const res = await postSDR(data)

    if (res.ok) {
      this.showMessage('SDR cadastrado com sucesso!', 'success')
    } else {
      if (res.data.error === 'email_already_used') {
        this.showMessage(`Ocorreu um erro: Esse e-mail já foi cadastrado!`, 'error')
      } else {
        this.showMessage(`Ocorreu um erro: ${res.data.error}`, 'error')
      }
    }
    }


  updateSDR = async (data: PostSDRRequest) => {
    await this.startRequest(BaseApi)
    const res = await updateSDR(data)

    this.processResponse(res, ['sdr'])

    if (res.ok) {
      this.showMessage('SDR atualizado com sucesso', 'success')
    } else {
      if (res.data.error === 'email_already_used') {
        this.showMessage(`Ocorreu um erro: Esse e-mail já foi cadastrado!`, 'error')
      } else {
        this.showMessage(`Ocorreu um erro: ${res.data.error}`, 'error')
      }
    }
  }

  deleteSdr = async (id: string) => {
    await this.startRequest(BaseApi)

    const res = await deleteSDR(id)

    this.processResponse(res, [])

    if (res.ok) {
      this.showMessage('SDR deletado com sucesso!', 'success')
    }
  }

  render() {
    const { children } = this.props
    return (
      <Provider
        value={{
          ...this.state,
          getSDR: this.getSDR,
          getSDRs:this.getSDRs,
          postSDR: this.postSDR,
          updateSDR: this.updateSDR,
          deleteSDR: this.deleteSdr,
        }}
      >
        { children }
      </ Provider>
    )
  }
}
