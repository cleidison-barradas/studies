import React, { createContext } from 'react'
import { BaseApi } from '../../config'
import Plan from '../../interfaces/plan'
import { getPlans, deletePlan, updatePlan, createPlan } from '../../services/api'
import { PutStorePlanRequest } from '../../services/api/interfaces/ApiRequest'
import { BaseContextProvider, BaseContextState } from '../BaseContext'

interface ContextState extends BaseContextState {
    plans: Plan[]
}

interface ContextData extends ContextState {
    getPlans: () => Promise<void>
    deletePlan: (id: Plan['_id'] | string) => Promise<void>
    updatePlan: (data: PutStorePlanRequest) => Promise<void>
    createPlan: (data: PutStorePlanRequest) => Promise<void>
}

const context = createContext({} as ContextData)
export default context
const { Provider, Consumer } = context

export const PlanConsumer = Consumer

export class PlanProvider extends BaseContextProvider {
    state: ContextState = {
        plans: [],
    }

    getPlans = async () => {
        this.startRequest(BaseApi)
        const response = await getPlans()
        this.processResponse(response, ['plans'])
    }

    deletePlan = async (id: Plan['_id'] | string) => {
        this.startRequest(BaseApi)
        const response = await deletePlan(id)
        this.processResponse(response, [])
        if (response.ok) {
            this.showMessage('Plano deletado com sucesso', 'success')
        }
    }

    updatePlan = async (data: PutStorePlanRequest) => {
        this.startRequest(BaseApi)
        const response = await updatePlan(data)
        this.processResponse(response, ['plan'])
        if (response.ok) {
            this.showMessage('Plano alterado com sucesso', 'success')
        }
    }

    createPlan = async (data: PutStorePlanRequest) => {
        this.startRequest(BaseApi)
        const response = await createPlan(data)
        this.processResponse(response, ['plan'])
        if (response.ok) {
            this.showMessage('Plano criado com sucesso', 'success')
        }
    }

    render() {
        const { children } = this.props
        return (
            <Provider
                value={{
                    ...this.state,
                    getPlans: this.getPlans,
                    deletePlan: this.deletePlan,
                    updatePlan: this.updatePlan,
                    createPlan: this.createPlan,
                }}
            >
                {children}
            </Provider>
        )
    }
}
