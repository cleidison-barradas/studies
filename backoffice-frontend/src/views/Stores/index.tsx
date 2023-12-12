import { Box, LinearProgress, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import StoresPaper from '../../components/Papers/StoresPaper'
import { StoreConsumer, StoreProvider } from '../../context/StoreContext'
import styles from './styles'

interface Props extends RouteComponentProps {
    classes: Record<keyof ReturnType<typeof styles>, string>
}

class Stores extends Component<Props> {
    render() {
        return (
            <StoreProvider>
                <StoreConsumer>
                    {({ stores, getStores, pagination, fetching }) => (
                        <React.Fragment>
                            <Box mt={2} mb={2} visibility={fetching ? 'visible' : 'hidden'}>
                                <LinearProgress />
                            </Box>

                            <StoresPaper stores={stores} getStores={getStores} pagination={pagination} />
                        </React.Fragment>
                    )}
                </StoreConsumer>
            </StoreProvider>
        )
    }
}

export default withStyles(styles)(Stores)
