import { createContext } from 'react'
import { BaseApi } from '../../config'
import User from '../../interfaces/user'
import { deleteUser, getUser, getUsers, postUser, updateUser } from '../../services/api'
import { GetUsersRequest, PostUserRequest } from '../../services/api/interfaces/ApiRequest'
import { BaseContextProvider, BaseContextState } from '../BaseContext'

interface ContextState extends BaseContextState {
    user?: User
    users: User[]
}

interface ContextData extends ContextState {
    getUsers: (data?: GetUsersRequest) => Promise<void>
    postUser: (data: PostUserRequest) => Promise<void>
    getUser: (id: string) => Promise<void>
    updateUser: (data: PostUserRequest) => Promise<void>
    deleteUser: (id: string) => Promise<void>
}

const context = createContext({} as ContextData)
export default context
const { Provider, Consumer } = context

export const UserConsumer = Consumer

export class UserProvider extends BaseContextProvider {
    state: ContextState = {
        users: [],
    }

    getUsers = async (data?: GetUsersRequest) => {
        await this.startRequest(BaseApi)
        const response = await getUsers(data)
        this.processResponse(response, ['users'])
    }

    postUser = async (data: PostUserRequest) => {
        await this.startRequest(BaseApi)
        const response = await postUser(data)
        this.processResponse(response, ['user'])
        if (response.ok) {
            this.showMessage('Usúario cadastrado com sucesso', 'success')
        } else {
            this.showMessage(`Ocorreu um erro ${response.data.error}`, 'error')

        }
    }

    getUser = async (id: string) => {
        await this.startRequest(BaseApi)
        const response = await getUser(id)
        this.processResponse(response, ['user'])
    }

    updateUser = async (data: PostUserRequest) => {
        await this.startRequest(BaseApi)
        const response = await updateUser(data)
        this.processResponse(response, ['user'])
        if (response.ok) {
            this.showMessage('Usúario atualizado com sucesso', 'success')
        }
    }

    deleteUser = async (id: string) => {
        await this.startRequest(BaseApi)
        const response = await deleteUser(id)
        this.processResponse(response, [])
        if (response.ok) {
            this.showMessage('Usúario deletado com sucesso', 'success')
        }
    }
    render() {
        const { children } = this.props
        return (
            <Provider
                value={{
                    ...this.state,
                    getUsers: this.getUsers,
                    postUser: this.postUser,
                    getUser: this.getUser,
                    updateUser: this.updateUser,
                    deleteUser: this.deleteUser,
                }}
            >
                {children}
            </Provider>
        )
    }
}
