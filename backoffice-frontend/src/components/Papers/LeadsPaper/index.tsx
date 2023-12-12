import React, { Component } from 'react'
import { Form, Formik } from 'formik'
import { Box, Button, Typography, withStyles } from '@material-ui/core'
import { isEqual } from 'lodash'

import { GetLeadsRequest, LeadsReportRequest } from '../../../services/api/interfaces/ApiRequest'
import Pagination from '../../../interfaces/pagination'
import Lead from '../../../interfaces/Lead'

import PaperBlock from '../../PaperBlock'
import LeadFilterForm from '../../Forms/LeadFilterForm'
import LeadTable from '../../Tables/LeadTable'

import styles from './styles'
import LeadReportDialog from '../../Dialogs/LeadReportDialog'

interface Props {
  leads: Lead[]
  pagination?: Pagination
  getLeads: (data?: GetLeadsRequest) => Promise<void>
  getLeadsReport: (data: LeadsReportRequest) => Promise<void>
  classes: Record<keyof ReturnType<typeof styles>, string>
}

interface State {
  open: boolean
}

export class LeadsPaper extends Component<Props, State> {
  initialValues: GetLeadsRequest = {
    limit: 20,
    page: 1
  }

  state: State = {
    open: false
  }

  async componentDidMount() {
    const { getLeads } = this.props
    await getLeads()
  }

  handleOpenModal = () => {
    const { open } = this.state

    this.setState(state => ({
      ...state,
      open: !open
    }))
  }

  render() {
    const { open } = this.state
    const { leads, getLeads, getLeadsReport, pagination, classes } = this.props
    return (
      <Box>
        <Box display="flex" justifyContent="space-between">
          <Typography className={classes.headertitle}>Leads</Typography>
          <Box display="flex" justifyContent="space-between" mb={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => window.location.href = 'https://indicacoes.mypharma.com.br/'}
            >
              Cadastrar Lead
            </Button>
            <Button onClick={this.handleOpenModal} variant="contained" className={classes.exportbtn}>
              Gerar Relatório dos Leads
            </Button>
          </Box>
        </Box>
        <Formik
          onSubmit={getLeads}
          enableReinitialize
          initialValues={this.initialValues}
        >
          {({ isSubmitting, initialValues, values, resetForm }) => (
            <Form>
              <Box />
              <PaperBlock>
                <LeadFilterForm
                  leads={leads}
                  getLeads={getLeads}
                  equal={isEqual(initialValues, values)}
                  isSubmitting={isSubmitting}
                  resetForm={resetForm}
                />
                <LeadTable
                  leads={leads}
                  pagination={pagination}
                />
              </PaperBlock>
            </Form>
          )}
        </Formik>
        {open &&
          <LeadReportDialog
            open={open}
            setOpen={this.handleOpenModal}
            onSubmit={getLeadsReport}
          />
        }
      </Box>

    )
  }
}

export default withStyles(styles)(LeadsPaper)
