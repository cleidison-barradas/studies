import React, { Component } from 'react'
import { Box, Button, Typography, withStyles } from '@material-ui/core'
import IntegrationReportDialog from '../../components/Dialogs/IntegrationReportDialog'
import IntegrationPaper from '../../components/Papers/IntegrationPaper'
import { IntegrationLogProvider, IntegrationLogConsumer } from '../../context/IntegrationContext'
import { IntegrationReportProvider, IntegrationReportConsumer } from '../../context/IntegrationReportContext'

import styles from './styles'

interface State {
  open: boolean
}

interface Props {
  classes: Record<keyof ReturnType<typeof styles>, string>,
}

class Integration extends Component<Props, State> {
  state: State = {
    open: false
  }

  handleOpenModal = () => {
    const { open } = this.state

    this.setState(state => ({
      ...state,
      open: !open
    }))
  }

  render() {
    const { classes } = this.props
    const { open } = this.state
    return (
      <Box>
        <IntegrationReportProvider>
          <IntegrationReportConsumer>
            {({ getIntegrationsReport }) => (
              <>
                <Box display="flex" justifyContent="space-between" mb={3}>
                  <Typography className={classes.headertitle}>Status de Integração</Typography>
                  <Box>
                    <Button onClick={this.handleOpenModal} variant="contained" className={classes.exportbtn}>Gerar Relatório das Integrações</Button>
                  </Box>
                </Box>
                <IntegrationLogProvider>
                  <IntegrationLogConsumer>
                    {({ fetching, integrations, pagination, requestGetIntegrationLog }) => (
                      <IntegrationPaper
                        fetching={fetching}
                        pagination={pagination}
                        integrations={integrations}
                        loadIntegrations={requestGetIntegrationLog}
                      />
                    )}
                  </IntegrationLogConsumer>
                </IntegrationLogProvider>
                {open &&
                  <IntegrationReportDialog
                    open={open}
                    setOpen={this.handleOpenModal}
                    onSubmit={getIntegrationsReport}
                  />
                }
              </>
            )}
          </IntegrationReportConsumer>
        </IntegrationReportProvider>
      </Box>
    )
  }
}

export default withStyles(styles)(Integration)
