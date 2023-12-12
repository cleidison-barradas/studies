import React, { Component } from 'react'
import { isEqual } from 'lodash'
import { Form, Formik } from 'formik'
import { Box, Button, CircularProgress, Grid, withStyles } from '@material-ui/core'

import { StoreForm } from '../../Forms'

import User from '../../../interfaces/user'
import Store from '../../../interfaces/store'

import {
    PutStoreRequest,
    GetUsersRequest,
    BasicFilterRequest,
    PostUpdateStoreProductsControlRequest,
} from '../../../services/api/interfaces/ApiRequest'
import styles from './styles'
import StoreProductsControlDialog from '../../Dialogs/StoreProductsControlDialog'
import { ReportConsumer, ReportProvider } from '../../../context/ReportContext'

interface Props {
    storeId: string
    store: Store | null
    storeUsers: User[]
    loadPlans: (data?: any) => Promise<void>
    getUsers: (data?: GetUsersRequest) => Promise<void>
    getStore: (storeId: string) => Promise<void>
    getPmcs: (data?: BasicFilterRequest) => Promise<void>
    onSubmit: (data: PutStoreRequest) => Promise<void>
    classes: Record<keyof ReturnType<typeof styles>, string>
    getApiIntegration: (storeId: string) => void
}

interface State {
    dialogOpen: boolean,
    productsControlDialogOpen: boolean,
}

class StorePaper extends Component<Props, State> {
    state = {
        dialogOpen: false,
        productsControlDialogOpen: false,
    }

    handleDialog = () => {
        this.setState((state) => ({
            ...state,
            dialogOpen: !state.dialogOpen
        }))
    }

    async componentDidMount() {
        const { storeId, getStore, getUsers, getPmcs, loadPlans, getApiIntegration } = this.props

        await Promise.all([getStore(storeId), getUsers(), getPmcs(), loadPlans(), getApiIntegration(storeId)])
    }

    handleOpenCloseProductsControlModal = () => {
        const { productsControlDialogOpen } = this.state

        this.setState(state => ({
            ...state,
            productsControlDialogOpen: !productsControlDialogOpen
        }))
    }

    render() {
        const { store, onSubmit, storeUsers } = this.props
        const { productsControlDialogOpen } = this.state

        const storeTenant = store?.tenant || ''
        const tenantRequest: PostUpdateStoreProductsControlRequest = { tenant: storeTenant }

        return (
            <Formik
                enableReinitialize
                onSubmit={onSubmit}
                initialValues={{
                    store
                }}
            >
                {({ values, isValid, isSubmitting, errors }) => (
                    <Form>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Box display='flex'>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={
                                            isSubmitting ||
                                            !isValid ||
                                            isEqual(values, {
                                                store,
                                                users: storeUsers,
                                            })
                                        }
                                    >
                                        {isSubmitting ? <CircularProgress size={26} color="primary" /> : 'Salvar'}
                                    </Button>
                                    <Button onClick={this.handleOpenCloseProductsControlModal} variant="contained" color="primary" style={{ marginLeft: '1%' }}>Atualizar Controle dos Produtos</Button>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                {store && (
                                    <StoreForm errors={errors.store as any} handleDialog={this.handleDialog} />
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={
                                        isSubmitting ||
                                        !isValid ||
                                        isEqual(values, {
                                            store,
                                            users: storeUsers,
                                        })
                                    }
                                >
                                    {isSubmitting ? <CircularProgress size={26} color="primary" /> : 'Salvar'}
                                </Button>

                                {productsControlDialogOpen &&
                                    <ReportProvider>
                                        <ReportConsumer>
                                            {({ updateStoreProductsControl }) => (
                                                <StoreProductsControlDialog
                                                    open={productsControlDialogOpen}
                                                    setOpen={this.handleOpenCloseProductsControlModal}
                                                    onSubmit={async () => { await updateStoreProductsControl(tenantRequest) }}
                                                />
                                            )}
                                        </ReportConsumer>
                                    </ReportProvider>
                                }
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        )
    }
}

export default withStyles(styles)(StorePaper)
