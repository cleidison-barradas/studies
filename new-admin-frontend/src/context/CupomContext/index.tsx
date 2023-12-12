import React, { createContext } from 'react'
import { BaseApi } from '../../config'
import Cupom from '../../interfaces/cupom'
import { deleteCupom, getCupoms, postCupom, putCupom } from '../../services/api'
import { RequestPutCupom } from '../../services/api/interfaces/ApiRequest'
import { BaseContextProvider, BaseContextState } from '../BaseContext'

interface CupomContextState extends BaseContextState {
  cupom: Cupom | null
  cupoms: Cupom[]
}

interface CupomContextData extends CupomContextState {
  getCupoms: () => void
  postCupom: (cupom: Cupom) => void
  putCupom: (data: RequestPutCupom) => Promise<void>
  deleteCupom: (_id: Cupom['_id']) => void
}

const CupomContext = createContext({} as CupomContextData)
export default CupomContext

const { Consumer, Provider } = CupomContext
export const CupomConsumer = Consumer

export class CupomProvider extends BaseContextProvider {
  state: CupomContextState = {
    fetching: false,
    success: false,
    error: null,
    errorObjects: null,
    deletedId: null,
    pagination: null,
    cupom: null,
    cupoms: [],
  }

  getCupoms = async (data?: any) => {
    this.startRequest(BaseApi)
    const response = await getCupoms(data)
    this.processResponse(response, ['cupoms'])
  }

  deleteCupom = async (_id: Cupom['_id']) => {
    this.startRequest(BaseApi)
    const response = await deleteCupom(_id!)
    this.processResponse(response)
  }

  postCupom = async (cupom: Cupom) => {
    this.startRequest(BaseApi)
    const response = await postCupom(cupom)
    this.processResponse(response, ['cupom'])
  }

  putCupom = async (data: RequestPutCupom) => {
    this.startRequest(BaseApi)
    const response = await putCupom(data)
    this.processResponse(response, ['cupom'])
  }

  /*
  postCupom = async (data: Cupom) => {
    this.startRequest(BaseApi)
    const response = await postCupom(data)
    this.processResponse(response, ['Cupom'])
    return response
  }
  */

  render() {
    const { children } = this.props
    return (
      <Provider
        value={{
          ...this.state,
          ...this,
        }}
      >
        {children}
      </Provider>
    )
  }
}
