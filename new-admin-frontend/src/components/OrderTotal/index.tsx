import React, { Component } from 'react'

import { Typography, withStyles } from '@material-ui/core'

import PaymentMethods from '../../interfaces/paymentMethods'


import styles from './styles'
import { floatToBRL } from '../../helpers/moneyFormat'

interface Props {
  classes: Record<keyof ReturnType<typeof styles>, string>
  paymentMethod: PaymentMethods | null
  totalOrder: number
}

export class TotalOrder extends Component<Props> {
  render() {
    const { classes, paymentMethod, totalOrder } = this.props
    const payment_installments = (paymentMethod && paymentMethod.details && paymentMethod.details.payment_installments) ? paymentMethod.details.payment_installments : 1

    return (
      ((payment_installments > 1) && (payment_installments <= 24))
        ? (
          <Typography className={classes.value}>{floatToBRL(totalOrder)} (em {payment_installments}x de {floatToBRL((totalOrder / payment_installments))}) </Typography>
        ) : (
          <Typography className={(classes.value)}>{floatToBRL(totalOrder)}</Typography>
        )
    )
  }
}

export default withStyles(styles)(TotalOrder)
