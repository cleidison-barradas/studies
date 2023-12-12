import { Button, Grid, Typography, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import PaperBlock from '../../PaperBlock'
import PaymentLinkImage from '../../../assets/images/ilustration/paymentLink.png'

import style from './style'

type Props = {
  classes: any
  createNew: any
}

class EmptyPaymentLink extends Component<Props> {
  render() {
    const { classes, createNew } = this.props
    return (
      <div style={{ height: '80%' }}>
        <PaperBlock>
          <Grid container spacing={5} justify="center" alignItems="center" style={{ height: '100%' }}>
            <Grid item style={{ width: '30%' }}>
              <img src={PaymentLinkImage} alt="Pagamentos com um clique" />
            </Grid>
            <Grid item>
              <Typography className={classes.title}>Pagamentos com um clique</Typography>
              <Typography className={classes.description}>
                Crie links de pagamento para pedidos do seu televendas, Whatsapp, etc.
                <br /> Torne seu delivery mais organizado e performático.
              </Typography>
              <Button color="primary" variant="contained" onClick={createNew}>
                crie seu primeiro link
              </Button>
            </Grid>
          </Grid>
        </PaperBlock>
      </div>
    )
  }
}

export default withStyles(style)(EmptyPaymentLink)
