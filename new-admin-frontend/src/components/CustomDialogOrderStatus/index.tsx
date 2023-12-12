import React, { Component } from 'react'
import { Button, withStyles, MenuItem, Grid, Typography } from '@material-ui/core'
import Status from '../../interfaces/orderStatus'
import style from './styles'
import { Field } from 'formik'
import SelectFormField from '../SelectFormField'
import TextFormField from '../TextFormField'
import SwitchFormField from '../SwitchFormField'

type Props = {
  order?: any
  classes: any
  status: Status[]
  deliveryMode?: string
  closeModal: () => void
  onSave: () => void
}


class CustomDialogOrderStatus extends Component<Props> {
  static defaultProps = {
    deliveyMode: 'own_delivery',
    classes: '',
  }

  state = {
    status: '',
    prevStatus: '',
    notifyValue: false,
  }

  async componentDidMount() {
    // set previous status to avoid reverse cancelled orders
    const { order } = this.props
    const prevStatusOrder = order.statusOrder.type

    this.setState({
      ...this.state,
      prevStatus: prevStatusOrder,
    })
  }

  handleNotifyClick = () => {
    this.setState ({
      notifyValue: !this.state.notifyValue,
    })
  }

  _renderStatus = () => {
    const { status } = this.props

    if (status.length > 0) {
      return status.map((st) => (
        <MenuItem key={st._id} value={st._id}>
          {st.name}
        </MenuItem>
      ))
    }
  }

  render() {
    const { order, classes, status, closeModal, onSave, deliveryMode } = this.props
    const optionName = order.paymentMethod ? order.paymentMethod.paymentOption?.name : ''
    const orderStock = order.stock ?  order.stock : 'local'
    const isRejectedDisabled = order.stock === 'virtual' && ['accepted', 'waiting', 'confirmed'].includes(order.statusOrder.type)

    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <div
            onClick={this.handleNotifyClick} style={{
              background: this.state.notifyValue ? 'rgba(88, 207, 178, 0.25)' : 'rgba(224, 232, 240, 1)',
              borderRadius: '50px',
              marginRight: '50%'
            }}
          >
          <Field name="notify" label="Notificar o cliente" labelPlacement="start" className={classes.label} component={SwitchFormField} />
          </div >
        </Grid>
        {orderStock === 'virtual' && (
          <Grid item xs={12}>
            <Typography className={classes.bodyText}>
            Ao aceitar pedidos com produtos do estoque virtual, ele será automaticamente
            enviado ao fornecedor para fazer o envio do produto via Pedidos Digitais.
            </Typography>
          </Grid>
        )}
        <Grid item xs={12}>
          <Field name="statusOrder" label="Status do pedido" component={SelectFormField} onFocus={(e: any) => this.setState({ ...this.state, status: e.target.innerText })}>
            {status
              .filter((st) => !st.name.includes("Pedidos digitais"))
              .map((st) => (
                <MenuItem
                  key={st._id}
                  value={st._id}
                  disabled={isRejectedDisabled && st.type === 'rejected'}
                >
                  {st.name}
                </MenuItem>
              ))}
          </Field>
        </Grid>
        {deliveryMode === 'delivery_company' && (
          <Grid item xs={12}>
            <Field label="Código de Rastreio" name="trackingCode" autoComplete="off" component={TextFormField} />
          </Grid>
        )}
        <Grid item xs={12}>
          <Typography className={classes.bodyText}>
            Adicione um comentário
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Field name="comments" autoComplete="off" multiline rows={3} component={TextFormField} />
        </Grid>
        {(this.state.status === "Estornado" && optionName === "Stone" && (this.state.prevStatus === "accepted" || this.state.prevStatus === "pending" || this.state.prevStatus === "payment_made")) ? (
          <Grid item xs={12}>
            <p style={{ color: "red", border: "1px solid red", padding: "8px", borderRadius: "18px" }}>Ao mudar para 'estornado' e salvar esta ação, o valor do pedido será estornado à conta do cliente automaticamente.</p>
          </Grid>
        ) : (this.state.status === "Estornado" && this.state.prevStatus !== "accepted" && this.state.prevStatus !== "pending" && this.state.prevStatus !== "payment_made") ? (
          <Grid item xs={12}>
            <p style={{ color: "red", border: "1px solid red", padding: "8px", borderRadius: "18px" }}>Este pedido não pode ser estornado pois já foi cancelado, rejeitado ou estornado anteriormente.</p>
          </Grid>
        )
          : null}
        <Grid item xs={6} lg={6} sm={6} md={6}>
          <Button variant="outlined" fullWidth classes={{ contained: classes.buttoncancel }} onClick={closeModal}
            style={{textTransform: 'none'}}
          >
            Cancelar
          </Button>
        </Grid>
        <Grid item xs={6} lg={6} sm={6} md={6}>
          <Button onClick={onSave} variant="contained" fullWidth classes={{ contained: classes.buttonconfirm }}
            disabled={this.state.status === "Estornado" && this.state.prevStatus !== "accepted" && this.state.prevStatus !== "pending" && this.state.prevStatus !== "payment_made"}
            style={{textTransform: 'none'}}
            >
            Salvar
          </Button>
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(style)(CustomDialogOrderStatus)