import { Component } from 'react'
import { ApiResponse } from '../../services/api/interfaces/ApiResponse'
import { setToken, setURL } from '../../services/api'
import Pagination from '../../interfaces/pagination'
import SnackbarContext from '../SnackbarContext'
import errorCodes, { ResponseStatus } from '../../helpers/responseStatus.helper'

export interface BaseContextState {
    fetching?: boolean
    success?: boolean
    error?: any
    errorObjects?: any
    deletedId?: any | null
    pagination?: Pagination
}

export const STORAGE_KEY = '@myp-admin/auth'
export const TENANT_KEY = '@myp-admin/tenant'

export class BaseContextProvider extends Component {
    static contextType = SnackbarContext
    context!: React.ContextType<typeof SnackbarContext>

    state: BaseContextState = {
        fetching: false,
        success: false,
        error: null,
        errorObjects: null,
        deletedId: null,
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

    showErrors = () => {
        const { openSnackbar } = this.context
        const { error } = this.state

        const errorCode = errorCodes.find((responseStatus: ResponseStatus) => responseStatus.code === error)

        if (errorCode && !errorCode.hidden) {
            openSnackbar(errorCode.message, errorCode.severity)
        }
    }

    showMessage = (message: string, severity: 'error' | 'info' | 'success' | 'warning') => {
        const { openSnackbar } = this.context

        openSnackbar(message, severity)
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

    /**
     * Process every response of this provider
     *
     * @param {GenericResponse<any>} response
     * @param {Array<string>} fields
     */
    public processResponse = (response: ApiResponse<any>, fields: string[] = []) => {
        const { ok, data, problem } = response

        if (ok && data) {
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
                updateObj.deletedId = deletedId
            }

            // If we do currentPage key, so we are dealing with a pagination
            if (currentPage) {
                updateObj.pagination = {
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
            let errorObjects = null
            // If we got some error from our API, so we should be aware of it
            if (data && data.error) {
                // If we have the error mapped lets find it
                const error = errorCodes.find((errorCode: ResponseStatus) => errorCode.code === data.error)

                if (error) {
                    if (error?.forceLogout) {
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
                        })
                    }
                    if (data.objects) {
                        errorObjects = data.objects
                    }

                    if (data) {
                        this.setState(
                            {
                                fetching: false,
                                success: false,
                                error: error.code,
                                errorObjects,
                            },
                            this.showErrors
                        )
                    }
                }
            } else {
                if (problem === 'NETWORK_ERROR') {
                    this.setState(
                        {
                            fetching: false,
                            success: false,
                            error: 'NETWORK_ERROR',
                            errorObjects,
                        },
                        this.showErrors
                    )
                }
            }
        }
    }
}
