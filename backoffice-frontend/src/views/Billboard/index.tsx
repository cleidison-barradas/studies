import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import BillboardPaper from '../../components/Papers/BillboardPaper'
import { BillboardConsumer, BillboardProvider } from '../../context/BillboardContext'

interface MatchParams {
    id: string
}

interface Props extends RouteComponentProps<MatchParams> {}

class Billboard extends Component<Props> {
    render() {
        const { match } = this.props
        const {
            params: { id },
        } = match
        return (
            <BillboardProvider>
                <BillboardConsumer>
                    {({ getBillboard }) => <BillboardPaper id={id} getBillboard={getBillboard} />}
                </BillboardConsumer>
            </BillboardProvider>
        )
    }
}

export default Billboard
