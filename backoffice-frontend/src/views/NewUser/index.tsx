import { withStyles } from '@material-ui/core'
import { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import UserPaper from '../../components/Papers/UserPaper'
import { StoreConsumer, StoreProvider } from '../../context/StoreContext'
import { UserConsumer, UserProvider } from '../../context/UserContext'
import styles from './styles'

interface Props extends RouteComponentProps {
    classes: Record<keyof ReturnType<typeof styles>, string>
}

class NewUser extends Component<Props> {
    render() {
        const { history } = this.props
        return (
            <StoreProvider>
                <UserProvider>
                    <StoreConsumer>
                        {({ stores, getStores }) => (
                            <UserConsumer>
                                {({ user, fetching, getUser, postUser }) => (
                                    <UserPaper
                                        postUser={postUser}
                                        getUser={getUser}
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

export default withStyles(styles)(NewUser)
