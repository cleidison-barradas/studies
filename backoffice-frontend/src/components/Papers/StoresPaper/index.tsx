import { Box, Button, Typography, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import PaperBlock from '../../PaperBlock'
import styles from './styles'
import { StoreFilterForm } from '../../Forms'
import Store from '../../../interfaces/store'
import { GetStoresRequest } from '../../../services/api/interfaces/ApiRequest'
import StoreTable from '../../Tables/StoreTable'
import { Form, Formik } from 'formik'
import Pagination from '../../../interfaces/pagination'
import { ReportConsumer, ReportProvider } from '../../../context/ReportContext'
import StoresReportDialog from '../../Dialogs/StoresReportDialog'
import GMVReportDialog from '../../Dialogs/GMVReportDialog'
import { Link } from 'react-router-dom'

interface State {
  open: boolean,
  openModalGMV: boolean
}

interface Props {
  classes: Record<keyof ReturnType<typeof styles>, string>
  stores: Store[]
  getStores: (data?: GetStoresRequest) => Promise<void>
  pagination?: Pagination
}
class StoresPaper extends Component<Props, State> {
  state: State = {
    open: false,
    openModalGMV: false
  }

  initialValues: GetStoresRequest = {
    name: '',
    updatedAt: undefined,
    page: 1,
    limit: 20,
    startDate: undefined,
    endDate: undefined,
  }

  async componentDidMount() {
    const { getStores } = this.props
    await getStores()
  }

  handleOpenModal = () => {
    const { open } = this.state

    this.setState(state => ({
      ...state,
      open: !open
    }))
  }

  handleOpenModalGMV = () => {
    const { openModalGMV } = this.state

    this.setState(state => ({
      ...state,
      openModalGMV: !openModalGMV
    }))
  }

  render() {
    const { stores, getStores, pagination, classes } = this.props
    const { open, openModalGMV } = this.state
    return (
      <Box>
        <ReportProvider>
          <ReportConsumer>
            {({ requestGetReport, requestGMVReport, removeCpfIndexes }) => (
              <>
                <Box display="flex" justifyContent="flex-start" mb={3} >
                  <Typography className={classes.headertitle}>Lojas</Typography>
                  <Button onClick={this.handleOpenModal} variant="contained" className={classes.exportbtn} style={{ marginLeft: '30%' }}>Gerar Relatório de Lojas</Button>
                  <Button onClick={async () => { await removeCpfIndexes() }} variant="contained" className={classes.exportbtn} style={{ marginLeft: '2%' }}>Remover Indexes de CPF</Button>
                  <Button onClick={this.handleOpenModalGMV} variant="contained" className={classes.exportbtn} style={{ marginLeft: '2%' }}>Gerar GMV</Button>
                </Box>
                <Box display="flex" justifyContent="flex-end" mb={3} >
                  <Link to="/reports">Página de Relatórios</Link>
                </Box>
                <PaperBlock>
                  <Formik onSubmit={getStores} enableReinitialize initialValues={this.initialValues}>
                    {({ isSubmitting, dirty }) => (
                      <Form>
                        <>
                          <StoreFilterForm
                            dirty={dirty}
                            stores={stores}
                            getStores={getStores}
                            isSubmitting={isSubmitting}
                          />
                          <StoreTable stores={stores} pagination={pagination} />
                        </>
                      </Form>
                    )}
                  </Formik>
                </PaperBlock>
                {open &&
                  <StoresReportDialog
                    open={open}
                    setOpen={this.handleOpenModal}
                    onSubmit={requestGetReport}
                  />
                }
                {openModalGMV &&
                  <GMVReportDialog
                    open={openModalGMV}
                    setOpen={this.handleOpenModalGMV}
                    onSubmit={requestGMVReport}
                  />
                }
              </>
            )}
          </ReportConsumer>
        </ReportProvider>
      </Box>
    )
  }
}

export default withStyles(styles)(StoresPaper)
