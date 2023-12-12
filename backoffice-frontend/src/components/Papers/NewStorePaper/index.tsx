import { Box, Button, Grid, withStyles } from '@material-ui/core'
import { Form, Formik } from 'formik'
import { RouteComponentProps } from 'react-router-dom'
import React, { Component } from 'react'
import { StoreForm } from '../../Forms'
import styles from './styles'
import * as yup from 'yup'
import {
    BasicFilterRequest,
    GetUsersRequest,
    PutStoreRequest,
    PutUserRequest,
} from '../../../services/api/interfaces/ApiRequest'
import NewUserDialog from '../../Dialogs/NewUserDialog'
import { GetStorePlanRequest } from '../../../services/api/interfaces/ApiRequest'

interface Props {
    loadPlans: (data?: GetStorePlanRequest) => Promise<void>
    getUsers: (data?: GetUsersRequest) => Promise<void>
    getPmcs: (data?: BasicFilterRequest) => Promise<void>
    putStore: (data?: PutStoreRequest) => Promise<void>
    putUser: (data: PutUserRequest) => Promise<void>
    history: RouteComponentProps['history']
    classes: Record<keyof ReturnType<typeof styles>, string>
}

interface State {
    dialogOpen: boolean
}

class NewStorePaper extends Component<Props, State> {
    state = {
        dialogOpen: false,
    }

    validationSchema = yup.object({
        store: yup.object().shape({
            name: yup.string().required('Nome da Loja é obrigatório'),
            url: yup.string().required('Url da Loja é obrigatório'),
            plan: yup.object().required('plano é obrigatório').nullable(true),
            settings: yup.object().shape({
                config_address: yup.string().required('Endereço da Loja é obrigatório'),
                config_cep: yup.string().required('CEP da Loja é obrigatório'),
                config_cnpj: yup.string().required('CNPJ da Loja é obrigatório'),
                config_email: yup.string().email().required('Email da Loja é obrigatório'),
                config_owner: yup.string().required('Proprietário da Loja é obrigatório'),
                config_pharmacist_crf: yup.string(),
                config_phone: yup.string().required('Telefone da Loja é obrigatório'),
                config_ssl: yup.string().required('Url ssl da Loja é obrigatório'),
            }),
        }),
        users: yup.array()
    })

    handleDialog = () => {
        this.setState({
            ...this.state,
            dialogOpen: !this.state.dialogOpen,
        })
    }

    componentDidMount() {
        const { getUsers, getPmcs, loadPlans } = this.props
        loadPlans()
        getUsers()
        getPmcs()
    }

    onSubmit = async (payload: PutStoreRequest) => {
        const { putStore } = this.props
        await putStore(payload)
    }

    render() {
        const { dialogOpen } = this.state
        const { putUser, getUsers } = this.props

        return (
            <React.Fragment>
                <Formik
                    initialValues={{
                        store: {
                            name: '',
                            url: '',
                            pmc: null,
                            plan: null,
                            settings: {
                                config_address: '',
                                config_cep: '',
                                config_cnpj: '',
                                config_email: '',
                                config_owner: '',
                                config_pharmacist_crf: '',
                                config_phone: '',
                                config_url: '',
                                config_ssl: '',
                                config_eurofarma_partner: false,
                            }
                        },
                        users: []
                    }}
                    enableReinitialize
                    onSubmit={this.onSubmit}
                    validationSchema={this.validationSchema}
                >
                    {({ isSubmitting, isValid, dirty, errors, resetForm }) => (
                        <Form >
                            <Box mb={2}>
                                <Grid container spacing={2}>
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            type="submit"
                                            disabled={isSubmitting || !isValid || !dirty}
                                        >
                                            Salvar
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button onClick={() => resetForm()}>Resetar</Button>
                                    </Grid>
                                </Grid>
                            </Box>

                            <StoreForm errors={errors.store as any} handleDialog={this.handleDialog} />
                            <Grid container spacing={2}>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        disabled={isSubmitting || !isValid}
                                    >
                                        Salvar
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button onClick={() => resetForm()}>Resetar</Button>
                                </Grid>
                            </Grid>
                            <NewUserDialog
                                handleClose={this.handleDialog}
                                handleSubmit={async (putUserRequest) => {
                                    await putUser(putUserRequest)
                                    await getUsers()
                                    this.handleDialog()
                                }}
                                open={dialogOpen}
                            />
                        </Form>

                    )}
                </Formik>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(NewStorePaper)
