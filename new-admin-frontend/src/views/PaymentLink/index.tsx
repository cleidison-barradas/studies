import React, { Component } from 'react'
import { Typography, withStyles, Grid, Box, Button } from '@material-ui/core'
import customerxService from '../../services/customerx.service'
import { PaymentLinkProvider, PaymentLinksConsumer } from '../../context/PaymentLinkContext'
import style from './style'
import PaymentLinkPaper from '../../components/Papers/PaymentLinkPaper'
import { RouteComponentProps } from 'react-router-dom'

interface Props extends RouteComponentProps {
  mode: string
  classes: any
}

class PaymentView extends Component<Props> {
  componentDidMount() {
    customerxService.trackingScreen()
  }

  createNewPaymentLink = () => {
    const { history } = this.props
    history.push('/televendas/add')
  }

  render() {
    const { classes } = this.props
    return (
      <PaymentLinkProvider>
        <PaymentLinksConsumer>
          {({ getPaymentLinks, paymentLinks, fetching, pagination, getCartByPaymentLink, deletePaymentLink }) => (
            <React.Fragment>
              <Box mb={2}>
                <Grid container justify="space-between" alignItems="center">
                  <Grid item>
                    <Typography className={classes.title}>Televendas</Typography>
                  </Grid>
                  <Grid item>
                    <Button color="primary" variant="contained" onClick={this.createNewPaymentLink}>
                      Gerar link de pagamento
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              <PaymentLinkPaper
                paymentLinks={paymentLinks}
                fetching={fetching}
                createNew={this.createNewPaymentLink}
                getPaymentLinks={getPaymentLinks}
                pagination={pagination}
                getCartByPaymentLink={getCartByPaymentLink}
                deletePaymentLink={deletePaymentLink}
              />
            </React.Fragment>
          )}
        </PaymentLinksConsumer>
      </PaymentLinkProvider>
    )
  }
}

export default withStyles(style)(PaymentView)
