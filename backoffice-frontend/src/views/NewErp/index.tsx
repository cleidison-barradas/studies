import { Box, LinearProgress, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import ErpPaper from '../../components/Papers/ErpPaper'
import { ErpConsumer, ErpProvider } from '../../context/ErpContext'
import styles from './styles'

interface Props extends RouteComponentProps {
    classes: Record<keyof ReturnType<typeof styles>, string>
}

class Erp extends Component<Props> {
    render() {
        const { history } = this.props
        return (
            <ErpProvider>
                <ErpConsumer>
                    {({ fetching, createErp, getErpVersions }) => (
                        <React.Fragment>
                            <Box mt={2} mb={2} visibility={fetching ? 'visible' : 'hidden'}>
                                <LinearProgress />
                            </Box>
                            <ErpPaper getErpVersions={getErpVersions} history={history} onSubmit={createErp} />
                        </React.Fragment>
                    )}
                </ErpConsumer>
            </ErpProvider>
        )
    }
}

export default withStyles(styles)(Erp)
