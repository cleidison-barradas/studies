import { Button, withStyles } from '@material-ui/core'
import { Component } from 'react'
import PaperBlock from '../../PaperBlock'
import { GetUsersRequest } from '../../../services/api/interfaces/ApiRequest'
import { Form, Formik } from 'formik'
import Pagination from '../../../interfaces/pagination'
import User from '../../../interfaces/user'
import styles from './styles'
import { UserFilterForm } from '../../Forms'
import { UserTable } from '../../Tables'
import { isEqual } from 'lodash'
import { RouteComponentProps } from 'react-router-dom'

interface Props {
    classes: Record<keyof ReturnType<typeof styles>, string>
    users: User[]
    getUsers: (data?: GetUsersRequest) => Promise<void>
    pagination?: Pagination
    history?: RouteComponentProps['history']
}

class UsersPaper extends Component<Props> {
    initialValues: GetUsersRequest = {
        limit: 20,
        page: 1,
    }

    async componentDidMount() {
        const { getUsers } = this.props
        await getUsers()
    }

    render() {
        const { users, getUsers, pagination, classes, history } = this.props
        return (
            <Formik onSubmit={getUsers} enableReinitialize initialValues={this.initialValues}>
                {({ isSubmitting, initialValues, values }) => (
                    <Form>
                        <div className={classes.flexEnd}>
                            <Button variant="contained" color="primary" onClick={() => history?.push('/users/new')}>
                                Cadastrar usuário
                            </Button>
                        </div>
                        <PaperBlock title="Usuários">
                            <UserFilterForm
                                users={users}
                                getUsers={getUsers}
                                equal={isEqual(initialValues, values)}
                                isSubmitting={isSubmitting}
                            />
                            <UserTable users={users} pagination={pagination} />
                        </PaperBlock>
                    </Form>
                )}
            </Formik>
        )
    }
}

export default withStyles(styles)(UsersPaper)
