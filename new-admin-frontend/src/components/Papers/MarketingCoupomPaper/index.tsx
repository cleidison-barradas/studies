import { LinearProgress, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import { ConfirmDialogConsumer, ConfirmDialogProvider } from '../../../context/ConfirmDialogContext'
import Cupom from '../../../interfaces/cupom'
import PaperBlock from '../../PaperBlock'

import SuportLink from '../../SuportLink'
import CupomTable from '../../Tables/CupomTable'
import EmptyCoupomPaper from '../EmptyCoupomPaper'
import style from './style'

type Props = {
    classes: any
    mode: any
    cupoms: Cupom[]
    deleteCupom: any
    getCupoms: (...args: any) => void
    postCupom: (cupom: Cupom) => void
    changeModal: (...args: any) => void
    fetching: any
    count: number
}

type State = {
    rowsPerPage: number
    page: number
}

class MarketingCoupomPaper extends Component<Props, State> {
    constructor(props: any) {
        super(props)

        this.state = {
            page: 0,
            rowsPerPage: 5,
        }
        this.handleChangePage = this.handleChangePage.bind(this)
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this)
    }

    load = async () => {
        const { getCupoms } = this.props
        const { page, rowsPerPage } = this.state
        await getCupoms({ page: page + 1, limit: rowsPerPage })
    }

    componentDidMount() {
        this.load()
    }

    handleChangePage(event: any, newPage: number) {
        this.setState(
            {
                ...this.state,
                page: newPage,
            },
            async () => {
                await this.load()
            }
        )
    }

    handleChangeRowsPerPage(event: any) {
        this.setState(
            {
                ...this.state,
                page: 0,
                rowsPerPage: parseInt(event.target.value, 10),
            },
            async () => {
                await this.load()
            }
        )
    }

    render() {
        const { mode, cupoms, deleteCupom, getCupoms, fetching, changeModal, count, postCupom } = this.props
        const { rowsPerPage, page } = this.state
        return (
            <div>
                {cupoms.length === 0 && !fetching ? (
                    <EmptyCoupomPaper mode={mode} changeModal={changeModal} />
                ) : (
                    <PaperBlock title="Todos os Cupons">
                        {fetching && <LinearProgress />}
                        <ConfirmDialogProvider>
                            <ConfirmDialogConsumer>
                                {({ openDialog, closeDialog }) => (
                                    <CupomTable
                                        cupoms={cupoms}
                                        deleteCupom={deleteCupom}
                                        getCupoms={getCupoms}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        postCupom={postCupom}
                                        handleChangeRowsPerPage={this.handleChangeRowsPerPage}
                                        handleChangePage={this.handleChangePage}
                                        count={count}
                                        closeDialog={closeDialog}
                                        openDialog={openDialog}
                                    />
                                )}
                            </ConfirmDialogConsumer>
                        </ConfirmDialogProvider>
                        <SuportLink query="cupom" />
                    </PaperBlock>
                )}
            </div>
        )
    }
}

export default withStyles(style)(MarketingCoupomPaper)
