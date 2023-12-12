import { Component } from 'react'
import { ApiResponse } from '../../services/api/interfaces/ApiResponse'
import { setToken, setURL } from '../../services/api'
import SnackbarContext from '../SnackbarContext'
import hiddenErrors from '../../helpers/hidden-errors'
import ErrorCodes from '../../helpers/error-codes'
import { RouteComponentProps } from 'react-router'

export interface BaseContextState {
  fetching?: boolean
  success?: boolean
  error?: any
  errorObjects?: any
  deletedId?: any | null
  pagination?: any | null
}

type Props = {
  openSnackbar?: any
  history?: RouteComponentProps['history']
}

export const STORAGE_KEY = '@myp-admin/auth'
export const TENANT_KEY = '@myp-admin/tenant'

const logoutErrors = {
  invalid_session: true,
  session_expired: true,
} as any

export class BaseContextProvider<T = {}> extends Component<Props & T> {
  static contextType = SnackbarContext
  state: BaseContextState = {
    fetching: false,
    success: false,
    error: null,
    errorObjects: null,
    deletedId: null,
    pagination: null,
  }

  static getDerivedStateFromProps(props: any, state: any) {
    const { accessToken } = state

    if (typeof accessToken === 'string' && accessToken.length > 0) {
      setToken(accessToken)
    }

    return state
  }

  /**
   * Reset errors from context
   */
  resetErrors = () => {
    this.setState({
      error: null,
      errorObjects: null,
    })
  }

  public startRequest(api: string) {
    return new Promise((resolve) => {
      setURL(api)
      this.setState(
        {
          fetching: true,
          error: null,
          errorObjects: null,
          deletedId: null,
        },
        () => resolve(this.state)
      )
    })
  }

  showMessage = (message: string, severity?: 'error' | 'info' | 'success' | 'warning') => {
    const { openSnackbar } = this.context

    openSnackbar(message, severity)
  }

  /**
   * Process every response of this provider
   *
   * @param {GenericResponse<any>} response
   * @param {Array<string>} fields
   */
  public processResponse = (response: ApiResponse<any>, fields: string[] = []) => {
    const { ok, data, problem } = response
    const { openSnackbar } = this.context
    if (ok) {
      const { total, limit, currentPage, deletedId }: any = data

      // We just need to update what the request returned :P
      const updateObj: any = {}

      // Parse our filtered fields
      fields.forEach((field) => {
        if (data[field] !== undefined) {
          updateObj[field] = data[field]
        }
      })

      // Something was deleted?
      if (deletedId) {
        updateObj['deletedId'] = deletedId
        if (typeof deletedId === 'string') {
          this.showMessage('Registro removido com successo')
        } else {
          this.showMessage(`${deletedId.length} Registro(s) removido(s) com successo`)
        }
      }

      // If we do currentPage key, so we are dealing with a pagination
      if (currentPage) {
        updateObj['pagination'] = {
          total,
          limit,
          currentPage,
        }
      }

      // Update our provider component
      this.setState({
        fetching: false,
        success: true,
        error: null,
        errorObjects: null,
        ...updateObj,
      })
    } else {
      // By default we should wait for a client error
      let error = problem
      let errorObjects = null

      // If we got some error from our API, so we should be aware of it
      if (data && data.error) {
        error = data.error
        // If we do have some objects error, we need them
        if (logoutErrors[data.error]) {
          this.setState({
            loggedIn: false,
            accessToken: '',
            refreshToken: '',
            user: null,
            fetching: false,
            success: false,
            error: null,
            errorObjects: null,
            deletedId: null,
            pagination: null,
            tenants: [],
            tenant: null,
          })
        }
        if (data.objects) {
          errorObjects = data.objects
        }
      }

      if (data) {
        this.setState(
          {
            fetching: false,
            success: false,
            error,
            errorObjects,
          },
          () => {
            if (!hiddenErrors[data.error]) {
              if(data.error === 'orders_not_found') this.showMessage('Erro, pedidos não encontrados no período e/ou origem selecionado(s)', 'error')
              else this.showMessage(ErrorCodes[data.error] ? ErrorCodes[data.error] : 'Erro, tente novamente mais tarde', 'error')
            }
          }
        )
      } else {
        if (problem === 'NETWORK_ERROR') {
          this.setState(
            {
              fetching: false,
              success: false,
              error,
              errorObjects,
            },
            () => {
              openSnackbar('Falha de conexão', 'error')
            }
          )
        }
      }
    }
  }
}
