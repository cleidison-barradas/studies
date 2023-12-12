import React, { Component } from 'react'
import { Grid, Typography, withStyles } from '@material-ui/core'
import styles from './styles'
import PaperBlock from '../PaperBlock'
import { PublicAddress } from '../../interfaces/publicAddress'
import ShippingOrder from '../../interfaces/shippingData'
import moment from 'moment'
import { floatToBRL } from '../../helpers/moneyFormat'

interface Props {
  address?: PublicAddress
  trackingCode?: string
  deliveryMode: string
  shipping: ShippingOrder | null
}

class CustomerAddressContainer extends Component<Props> {
  static defaultProps = {
    deliveryMode: 'own_delivery',
  }
  _renderTitle = (deliveryMode: string) => {
    switch (deliveryMode) {
      case 'delivery_company':
        return 'Endereço de Envio da Encomenda'

      case 'own_delivery':
        return 'Endereço de Entrega'

      case 'store_pickup':
        return 'Retirada na Loja'

      default:
        return 'Endereço de Entrega'
    }
  }

  _renderAddress = () => {
    const { deliveryMode, address, trackingCode, shipping } = this.props

    switch (deliveryMode) {
      case 'delivery_company':
        return (
          <Grid item xs={12} lg={12} md={6} sm={6}>
            <Typography>
              {address?.street} {address?.number} Bairro {address?.neighborhood.name} {address?.postcode}{' '}
              {address?.neighborhood.city.name} {address?.neighborhood.city.state.name} {address?.complement}
            </Typography>
            <Typography>
              Forma de envio: {shipping?.name} {shipping?.company.name} Estimativa de entrega{' '}
              {moment().add(shipping?.custom_delivery_range.min, 'd').format('DD-MM-YYYY')} à{' '}
              {moment().add(shipping?.custom_delivery_range.max, 'd').format('DD-MM-YYYY')}
            </Typography>
            <Typography>Valor de Frete: {floatToBRL(Number(shipping?.price))}</Typography>
            {trackingCode && <Typography>Código de Rastreio {trackingCode}</Typography>}
          </Grid>
        )

      case 'own_delivery':
        if (address?.notDeliverable) {
          return (
            <Grid item>
              <Typography>Retirar na Loja</Typography>
            </Grid>
          )
        }

        return (
          <Grid item>
            <Typography>
              {address?.street}
              {address?.number} {address?.neighborhood.name} {address?.neighborhood.city.name} {address?.complement}
            </Typography>
          </Grid>
        )

      case 'store_pickup':
        return (
          <Grid item>
            <Typography>Retirar na Loja</Typography>
          </Grid>
        )

      default:
        return (
          <Grid item>
            <Typography>
              {address?.street} {address?.number} {address?.neighborhood.name} {address?.neighborhood.city.name}{' '}
              {address?.complement}
            </Typography>
          </Grid>
        )
    }
  }

  render() {
    return (
      <PaperBlock title={this._renderTitle(this.props.deliveryMode)}>
        <Grid container spacing={3}>
          {this._renderAddress()}
        </Grid>
      </PaperBlock>
    )
  }
}

export default withStyles(styles)(CustomerAddressContainer)
