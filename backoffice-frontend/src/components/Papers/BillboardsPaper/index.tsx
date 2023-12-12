import { withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import PaperBlock from '../../PaperBlock'
import BillboardTable from '../../Tables/BillboardTable'
import styles from './styles'

interface Props {
    classes: Record<keyof ReturnType<typeof styles>, string>
    getBillboard: () => Promise<void>
}

class BillboardsPaper extends Component<Props> {
    async componentDidMount() {
        const { getBillboard } = this.props
        await getBillboard()
    }

    render() {
        const { getBillboard } = this.props
        return (
            <PaperBlock title="Quadro de avisos">
                <BillboardTable refresh={getBillboard} />
            </PaperBlock>
        )
    }
}

export default withStyles(styles)(BillboardsPaper)
