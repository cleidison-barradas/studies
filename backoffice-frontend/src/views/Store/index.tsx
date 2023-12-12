import { Box, LinearProgress, Tab, Tabs, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import MarketingPaper from '../../components/Papers/MarketingPaper'
import IntegrationApiPaper from '../../components/Papers/IntegrationApiPaper'
import StorePaper from '../../components/Papers/StorePaper'
import { PlanConsumer, PlanProvider } from '../../context/PlanContext'
import { PmcConsumer, PmcProvider } from '../../context/PmcContext'
import { StoreConsumer, StoreProvider } from '../../context/StoreContext'
import { UserConsumer, UserProvider } from '../../context/UserContext'
import styles from './styles'

interface MatchProps {
    id: string
}

interface Props extends RouteComponentProps<MatchProps, {}, {}> {
    classes: Record<keyof ReturnType<typeof styles>, string>
}

interface State {
    tab: number
}

class Store extends Component<Props, State> {
    state = {
        tab: 0,
    }

    setTab = (event: React.ChangeEvent<{}>, tab: number) => {
        this.setState({
            ...this.state,
            tab,
        })
    }
    render() {
        const { match: { params } } = this.props
        const { tab } = this.state

        return (
            <React.Fragment>
                <UserProvider>
                    <StoreProvider>
                        <PmcProvider>
                            <PlanProvider>
                                <Box mb={3}>
                                    <Tabs
                                        value={tab}
                                        onChange={this.setTab}
                                        indicatorColor="primary"
                                        textColor="primary"
                                    >
                                        <Tab label="Dados da loja" />
                                        <Tab label="Marketing" />
                                        <Tab label="Integrações" />
                                        <Tab label="Insights" disabled />
                                    </Tabs>
                                </Box>
                                <UserConsumer>
                                    {({ getUsers }) => (
                                        <StoreConsumer>
                                            {({ store, getStore, integrationData, getApiIntegration, putApiIntegration, postStore, fetching }) => (
                                                <PmcConsumer>
                                                    {({ getPmcs }) => (
                                                        <PlanConsumer>
                                                            {({ getPlans }) => (
                                                                <React.Fragment>
                                                                    <Box
                                                                        mt={2}
                                                                        mb={2}
                                                                        visibility={fetching ? 'visible' : 'hidden'}
                                                                    >
                                                                        <LinearProgress />
                                                                    </Box>
                                                                    {tab === 0 && (
                                                                        <StorePaper
                                                                            store={store}
                                                                            storeId={params.id}
                                                                            storeUsers={[]}
                                                                            getPmcs={getPmcs}
                                                                            getUsers={getUsers}
                                                                            getStore={getStore}
                                                                            loadPlans={getPlans}
                                                                            onSubmit={async data => {
                                                                                await postStore(params.id, data)
                                                                                await getStore(params.id)
                                                                            }}
                                                                            getApiIntegration={getApiIntegration}
                                                                        />
                                                                    )}
                                                                    {tab === 1 && <MarketingPaper store={store} />}
                                                                    {tab === 2 && <IntegrationApiPaper
                                                                        store={store}
                                                                        putApiIntegration={putApiIntegration}
                                                                        getApiIntegration={getApiIntegration}
                                                                        integrationData={integrationData}
                                                                    />}
                                                                </React.Fragment>
                                                            )}
                                                        </PlanConsumer>
                                                    )}
                                                </PmcConsumer>
                                            )}
                                        </StoreConsumer>
                                    )}
                                </UserConsumer>
                            </PlanProvider>
                        </PmcProvider>
                    </StoreProvider>
                </UserProvider>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(Store)
