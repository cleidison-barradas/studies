import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Box, LinearProgress, withStyles } from '@material-ui/core'

import { LeadConsumer, LeadProvider } from '../../context/LeadContext'
import LeadsPaper from '../../components/Papers/LeadsPaper'

import styles from './styles'
interface Props extends RouteComponentProps {
  classes: Record<keyof ReturnType<typeof styles>, string>
}

export class Leads extends Component<Props> {
  render() {
    const { classes } = this.props
    return (
      <Box>
        <LeadProvider>
          <LeadConsumer>
            {({ getLeadsReport, getLeads, fetching, pagination, leads, }) => (
              <>
                <Box mt={2} mb={2} visibility={fetching ? 'visible' : 'hidden'}>
                  <LinearProgress />
                </Box>
                <LeadsPaper
                  leads={leads}
                  pagination={pagination}
                  getLeads={getLeads}
                  classes={classes}
                  getLeadsReport={getLeadsReport}
                />
              </>
            )}
          </LeadConsumer>
        </LeadProvider>
      </Box>
    )
  }
}

export default withStyles(styles)(Leads)
