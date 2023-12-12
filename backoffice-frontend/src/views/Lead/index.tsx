import React, { Component } from 'react'
import { withStyles } from '@material-ui/core'
import { RouteComponentProps } from 'react-router-dom'

import { LeadConsumer, LeadProvider } from '../../context/LeadContext'

import LeadPaper from '../../components/Papers/LeadPaper'

import styles from './styles'

interface Params {
  id: string
}

interface Props extends RouteComponentProps<Params> {
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class Lead extends Component<Props> {
  render() {
    const { match: { params: { id } }, history } = this.props
    return (
      <LeadProvider>
        <LeadConsumer>
          {({ lead, getLead, updateLead }) => (
            <LeadPaper
              getLead={getLead}
              updateLead={updateLead}
              _id={id}
              history={history}
              lead={lead}
            />
          )}
        </LeadConsumer>
      </LeadProvider>
    )
  }
}

export default withStyles(styles)(Lead)
