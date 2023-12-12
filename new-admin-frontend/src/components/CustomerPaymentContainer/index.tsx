import React, { Component } from 'react'
import { Typography, withStyles } from '@material-ui/core'
import styles from './styles'
import PaymentMethods from '../../interfaces/paymentMethods'
import { floatToBRL } from '../../helpers/moneyFormat'

interface Props {
  paymentCode?: string
  moneyChange: number
  covenantName?: string
  payment?: PaymentMethods | null
}

class CustomerPaymentContainer extends Component<Props> {
  static defaultProps = {
    payment: null,
    paymentCode: '',
    moneyChange: 0,
  }

  _renderPaymentView = () => {
    const { payment, moneyChange, covenantName } = this.props
    console.log(payment)
    if (payment) {
      const name = payment.paymentOption && payment.paymentOption.name ? payment.paymentOption.name : ''
      const type = payment.paymentOption && payment.paymentOption.type ? payment.paymentOption.type : ''
      const payment_installments = payment.details?.payment_installments ?? 1
      let payment_type = ""
      if (type) {
        if (payment.details?.payment_type === "credit") {
          payment_type = "Crédito"
        }
      }
      switch (payment.paymentOption?.type) {
        case 'debit':
          return <Typography>Pagamento na Entrega {payment.paymentOption?.name}</Typography>

        case 'credit':
          return <Typography>Pagamento na Entrega {name}</Typography>

        case 'covenant':
          return (
            payment_installments !== 1
              ? (<Typography>Convênio Parcelado {covenantName} (em {payment_installments}x)</Typography>)
              : (<Typography>Convênio {covenantName}</Typography>)
          )

        case 'gateway':
          return (
            payment_installments !== 1
              ? (<Typography>Pagamento Online {name} (em {payment_installments}x)</Typography>)
              : (<Typography>Pagamento Online {name}</Typography>)
          )

        case 'ticket':
          return <Typography>Pagamento via boleto</Typography>

        case 'money':
          return (
            <Typography>
              Pagamento na Entrega {name} troco: para {floatToBRL(moneyChange || 0)}{' '}
            </Typography>
          )

        case 'External':
          return <Typography>Pagamento feito pela integração {name} | {payment_type} em {payment_installments}x</Typography>

        default:
          return <Typography>Pagamento não informado {type}</Typography>
      }
    }
    return <Typography>Pagamento não informado</Typography>
  }

  render() {
    return <React.Fragment>{this._renderPaymentView()}</React.Fragment>
  }
}

export default withStyles(styles)(CustomerPaymentContainer)
