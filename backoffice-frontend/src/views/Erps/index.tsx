import { withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import ErpsPaper from '../../components/Papers/ErpsPaper'
import { ErpConsumer, ErpProvider } from '../../context/ErpContext'
import styles from './styles'

interface Props extends RouteComponentProps {
    classes: Record<keyof ReturnType<typeof styles>, string>
}

class Erps extends Component<Props> {
    render() {
        const { history } = this.props
        return (
            <ErpProvider>
                <ErpConsumer>{({ getErps }) => <ErpsPaper history={history} getErps={getErps} />}</ErpConsumer>
            </ErpProvider>
        )
    }
}

export default withStyles(styles)(Erps)
