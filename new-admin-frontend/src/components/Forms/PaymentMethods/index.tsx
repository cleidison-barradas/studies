import { Typography, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import PaperBlock from '../../PaperBlock'

import NewPaymentMethods from '../NewPaymentMethods'
import PaymentMethodTable from '../PaymentMethodsTable'
import PaymentInterface from '../../../interfaces/paymentMethods'
import _ from 'lodash'
import styles from './styles'
import SuportLink from '../../SuportLink'

type Props = {
    mode: any
    classes: any
    fetching: boolean
    pagiantion: {
        limit: number
    }
    error: any
    loadPayments: (id?: string, page?: any, limit?: any) => Promise<any>
    loadPaymentOption: () => Promise<any>
    onSave: (data: any) => void
    onDelete: (data: any) => void
    addNewPaymentOptions: (data: any) => void
}

type State = {
    initialState: any
    data: {
        paymentMethods: PaymentInterface[]
    }
    deleteData: {
        payments: any[]
    }
    payments: {
        paymentsEdited: any[]
        paymentsAdded: any[]
    }
}

class PaymentMethods extends Component<Props, State> {
    static defaultProps = {
        fetching: false,
        error: false,
    }

    constructor(props: any) {
        super(props)
        this.state = {
            initialState: {},
            data: {
                paymentMethods: [],
            },
            deleteData: {
                payments: [],
            },
            payments: {
                paymentsEdited: [],
                paymentsAdded: [],
            },
        }
    }

    onLoad = async (id?: string, page?: any, limit?: any) => {
        const { loadPayments } = this.props
        const response = await loadPayments(id, page, limit)

        this.setState((state) => ({
            ...state,
            data: {
                ...state.data,
                paymentMethods: response,
            },
            initialState: { ...state.payments },
        }))
    }

    componentDidMount() {
        this.onLoad()
    }

    handleSetAddedPayments = (data: any) => {
        this.setState((state: any) => ({
            ...state,
            payments: {
                ...state.payments,
                paymentsAdded: data,
            },
        }))
    }

    handleSetEditedPayments = (data: any = []) => {
        this.setState((state: any) => ({
            ...state,
            payments: {
                ...state.payments,
                paymentsEdited: data,
            },
        }))
    }

    /**
     * Save Payments
     *
     * @param data
     * @param dispatch
     */
    handleSavePayment = (data: any, dispatch: (value: any) => void) => {
        let {
            payments: { paymentsEdited },
        } = this.state

        if (paymentsEdited.length > 0) {
            paymentsEdited = paymentsEdited.map((payment) => {
                const { paymentOption } = payment
                const { _id, name } = paymentOption

                return {
                    _id,
                    name,
                }
            })
        }
        const values = {
            ...data,
            paymentsEdited,
        }

        dispatch(values)
        this.setState(
            {
                payments: {
                    paymentsAdded: [],
                    paymentsEdited: [],
                },
            },
            () => {
                setTimeout(() => {
                    this.onLoad()
                }, 1500)
            }
        )
    }

    /**
     * Delete Payment
     *
     * @param data
     * @param dispatch
     */
    handleDeletePayment = (data: any) => {
        const { onDelete } = this.props
        onDelete(data)

        setTimeout(() => {
            this.onLoad()
        }, 1500)
    }

    handleLoadPayments = (id?: string, page?: any, limit?: any) => {
        this.setState(
            {
                data: {
                    paymentMethods: [],
                },
            },
            () => {
                this.onLoad(id, page, limit)
            }
        )
    }

    handleSavaPayments = (data: any) => {
        const { onSave } = this.props
        onSave(data)
    }

    render() {
        const { classes, pagiantion, fetching, onSave, loadPaymentOption, addNewPaymentOptions } = this.props
        const {
            data: { paymentMethods },
            initialState,
            payments,
        } = this.state

        return (
            <div>
                <PaperBlock title={'Formas de pagamento'}>
                    <Typography className={classes.caption}>Já cadastradas</Typography>
                    <PaymentMethodTable
                        classes={classes}
                        loadPayments={this.handleLoadPayments}
                        pagination={pagiantion}
                        onDelete={(data: any) => this.handleDeletePayment(data)}
                        onEditing={this.handleSetEditedPayments}
                        fetching={fetching}
                        paymentMethods={paymentMethods}
                    />
                    <NewPaymentMethods
                        loadPaymentOption={loadPaymentOption}
                        onSave={(data: any) => this.handleSavePayment(data, onSave)}
                        setAddedPayments={this.handleSetAddedPayments}
                        disabled={_.isEqual(initialState, payments)}
                        addNewPaymentOptions={addNewPaymentOptions}
                    />
                    <SuportLink query="metodos de pagamento" />
                </PaperBlock>
            </div>
        )
    }
}

export default withStyles(styles)(PaymentMethods)
