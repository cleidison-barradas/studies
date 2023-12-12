import React, { Component } from 'react'
import { Typography, withStyles } from '@material-ui/core'
import { format } from 'date-fns'

import { LeadStatus } from '../../interfaces/Lead'

import styles from './styles'

interface Props {
  value: LeadStatus[]
  classes: Record<keyof ReturnType<typeof styles>, string>
}

export class StatusHistoryField extends Component<Props> {

  getStatus(status: string) {
    switch (status) {
      case 'open':
        return 'Aberto'
      case 'pending':
        return 'Em Andamento'
      case 'closed':
        return 'Fechado'
      default:
        return 'Desconhecido'
    }
  }

  render() {
    const { value, classes } = this.props
    if (!value || value.length < 2) {
      return ''
    }

    return (
      <Typography className={classes.paragraph}>
        Status alterado de '{this.getStatus(value[value.length - 2].status)}' para '{this.getStatus(value[value.length - 1].status)}' em {format(new Date(value[value.length - 1].createdAt), 'dd/MM/yyyy')} às {format(new Date(value[value.length - 1].createdAt), 'HH:mm')}
      </Typography>
    )
  }
}

export default withStyles(styles)(StatusHistoryField)
