import { Box, LinearProgress, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { ErpConsumer } from '../../../context/ErpContext'
import { BasicFilterRequest } from '../../../services/api/interfaces/ApiRequest'
import PaperBlock from '../../PaperBlock'
import ErpTable from '../../Tables/ErpTable'
import styles from './styles'

interface Props {
    classes: Record<keyof ReturnType<typeof styles>, string>
    getErps: (data?: BasicFilterRequest) => Promise<void>
    history: RouteComponentProps['history']
}

class ErpsPaper extends Component<Props> {
    async componentDidMount() {
        const { getErps } = this.props
        await getErps()
    }

    render() {
        const { history } = this.props
        return (
            <ErpConsumer>
                {({ fetching }) => (
                    <React.Fragment>
                        <Box mt={2} mb={2} visibility={fetching ? 'visible' : 'hidden'}>
                            <LinearProgress />
                        </Box>
                        <PaperBlock>
                            <ErpTable history={history} />
                        </PaperBlock>
                    </React.Fragment>
                )}
            </ErpConsumer>
        )
    }
}

export default withStyles(styles)(ErpsPaper)
