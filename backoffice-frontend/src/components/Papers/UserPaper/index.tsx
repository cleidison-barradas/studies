import { Button, CircularProgress, Grid, LinearProgress, Typography, withStyles } from '@material-ui/core'
import { Form, Formik } from 'formik'
import React, { Component } from 'react'
import styles from './styles'
import { Link, RouteComponentProps } from 'react-router-dom'
import { ReactComponent as GoBackArrow } from '../../../assets/images/icons/blueBackArrow.svg'
import Store from '../../../interfaces/store'
import * as yup from 'yup'
import { isEqual } from 'lodash'
import { GetStoresRequest, GetUsersRequest, PostUserRequest } from '../../../services/api/interfaces/ApiRequest'
import User from '../../../interfaces/user'
import { NewUserForm } from '../../Forms'

interface Props {
    classes: Record<keyof ReturnType<typeof styles>, string>
    fetching?: boolean
    user?: User
    stores?: Store[]
    _id?: string
    save: (data: User) => Promise<void>
    getStores: (data?: GetStoresRequest) => Promise<void>
    postUser: (data: PostUserRequest) => Promise<void>
    getUser: (id: string) => Promise<void>
    updateUser?: (data: PostUserRequest) => Promise<void>
    history: RouteComponentProps['history']
}

interface State {
    user: User
}

class NewUserPaper extends Component<Props, State> {
    state: State = {
        user: {
            userName: '',
            password: '',
            email: '',
            role: 'store',
            status: 'active',
            store: [],
        },
    }

    initialValues: GetUsersRequest = {
        limit: 10,
        page: 1,
    }

    async componentDidMount() {
        const { getStores, _id, getUser } = this.props
        await getStores()
        if (_id && getUser) {
            await getUser(_id)
        }
    }

    save = async (user: User) => {
        const { postUser, history, _id, updateUser } = this.props
        if (_id) {
            await updateUser!({ ...user })
        } else {
            await postUser({ ...user })
        }
        history.replace('/users')
    }

    validationSchema = yup.object({
        userName: yup.string().required(),
        password: yup.string().required(),
        email: yup.string().email().required(),
        role: yup.string().required(),
        status: yup.string().required(),
        store: yup.mixed(),
    })

    render() {
        const { classes, _id, fetching, stores, user } = this.props
        return (
            <React.Fragment>
                <Formik
                    initialValues={user || this.state.user}
                    enableReinitialize
                    onSubmit={this.save}
                    validationSchema={this.validationSchema}
                >
                    {({ isSubmitting, values, isValid, initialValues }) => (
                        <Form>
                            {fetching && <LinearProgress />}
                            <Grid container alignItems="center" justify="space-between" className={classes.header}>
                                <Grid item className={classes.headergrid1} xs={12} md={12} lg={6}>
                                    <Grid container alignItems="center" spacing={2}>
                                        <Link to="/users" className={classes.goback}>
                                            <GoBackArrow />
                                        </Link>
                                        <Typography className={classes.gobacktext}>
                                            {_id ? 'Atualizar Usuário' : 'Cadastrar Usuário'}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container={window.innerWidth < 1200} alignItems="center" justify="space-between">
                                    <Button
                                        type="submit"
                                        color="primary"
                                        variant="contained"
                                        disabled={isSubmitting || !isValid || isEqual(initialValues, values)}
                                    >
                                        {isSubmitting ? <CircularProgress size={20} /> : 'Salvar'}
                                    </Button>
                                </Grid>
                            </Grid>
                            <NewUserForm stores={stores} values={{ ...values }} />
                            <Grid
                                container={window.innerWidth < 1200}
                                alignItems="center"
                                justify="space-between"
                                md={12}
                            >
                                <Button
                                    type="submit"
                                    color="primary"
                                    variant="contained"
                                    disabled={isSubmitting || !isValid || isEqual(initialValues, values)}
                                >
                                    {isSubmitting ? <CircularProgress size={20} /> : 'Salvar'}
                                </Button>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(NewUserPaper)
