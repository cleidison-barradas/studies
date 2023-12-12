import { withStyles } from '@material-ui/core'
import { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import UserPaper from '../../components/Papers/UserPaper'
import { StoreConsumer, StoreProvider } from '../../context/StoreContext'
import { UserConsumer, UserProvider } from '../../context/UserContext'
import styles from './styles'

interface Params {
    id: string
}

interface Props extends RouteComponentProps<Params> {
    classes: Record<keyof ReturnType<typeof styles>, string>
}

class User extends Component<Props> {
    render() {
        const {
            match: {
                params: { id },
            },
            history,
        } = this.props
        return (
            <StoreProvider>
                <UserProvider>
                    <StoreConsumer>
                        {({ stores, getStores }) => (
                            <UserConsumer>
                                {({ user, fetching, getUser, postUser, updateUser }) => (
                                    <UserPaper
                                        updateUser={updateUser}
                                        postUser={postUser}
                                        getUser={getUser}
                                        _id={id}
                                        history={history}
                                        fetching={fetching}
                                        user={user}
                                        stores={stores}
                                        getStores={getStores}
                                        save={() => {
                                            return new Promise((resolve) => {
                                                resolve()
                                            })
                                        }}
                                    />
                                )}
                            </UserConsumer>
                        )}
                    </StoreConsumer>
                </UserProvider>
            </StoreProvider>
        )
    }
}

export default withStyles(styles)(User)
