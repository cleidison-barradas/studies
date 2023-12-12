import { withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import NewStorePaper from '../../components/Papers/NewStorePaper'
import { PlanConsumer, PlanProvider } from '../../context/PlanContext'
import { PmcConsumer, PmcProvider } from '../../context/PmcContext'
import { StoreConsumer, StoreProvider } from '../../context/StoreContext'
import { UserConsumer, UserProvider } from '../../context/UserContext'
import styles from './styles'

interface Props extends RouteComponentProps {
    classes: Record<keyof ReturnType<typeof styles>, string>
}

class NewStore extends Component<Props> {
    render() {
        const { history } = this.props
        return (
            <StoreProvider>
                <UserProvider>
                    <PmcProvider>
                        <PlanProvider>
                            <PmcConsumer>
                                {({ getPmcs }) => (
                                    <UserConsumer>
                                        {({ getUsers, postUser }) => (
                                            <StoreConsumer>
                                                {({ putStore }) => (
                                                    <PlanConsumer>
                                                        {({ getPlans }) => (
                                                            <NewStorePaper
                                                                history={history}
                                                                getPmcs={getPmcs}
                                                                putUser={postUser}
                                                                getUsers={getUsers}
                                                                putStore={putStore}
                                                                loadPlans={getPlans}
                                                            />
                                                        )}
                                                    </PlanConsumer>
                                                )}
                                            </StoreConsumer>
                                        )}
                                    </UserConsumer>
                                )}
                            </PmcConsumer>
                        </PlanProvider>
                    </PmcProvider>
                </UserProvider>
            </StoreProvider>
        )
    }
}

export default withStyles(styles)(NewStore)
