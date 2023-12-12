import React, { Component } from 'react'
import { Box, Button, Divider, Grid, Typography, withStyles } from '@material-ui/core'
import MarketingPromotionPaper from '../../components/Papers/MarketingPromotionPaper'
import { RouteComponentProps } from 'react-router-dom'
import LaunchIcon from '@material-ui/icons/Launch'
import { HelpOutline } from '@material-ui/icons'
import { ProductPromotionProvider, ProductPromotionConsumer } from '../../context/ProductPromotionContext'
import style from './style'
import customerxService from '../../services/customerx.service'

interface Props extends RouteComponentProps {
  classes: any
  mode: any
}

class MarketingPromotion extends Component<Props> {
  componentDidMount() {
    customerxService.trackingScreen()
  }

  render() {
    const { classes, mode, history } = this.props

    return (
      <ProductPromotionProvider>
        <ProductPromotionConsumer>
          {({ requestGetProductPromotions, requestDeleteProductPromotions, promotions, fetching, pagination }) => {
            return (
              <React.Fragment>
                <Box mb={2}>
                  <Grid container justify="space-between" alignItems="center">
                    <Grid item>
                      <Typography className={classes.title}>Promoções</Typography>
                    </Grid>
                    <Grid item>
                      <Button color="primary" variant="contained" onClick={() => history.push('/marketing/promotions/add')}>
                        Criar promoção
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
                <MarketingPromotionPaper
                  {...this.props}
                  mode={mode}
                  history={history}
                  fetching={fetching}
                  pagination={pagination}
                  promotions={promotions}
                  onDelete={requestDeleteProductPromotions}
                  loadPromotions={requestGetProductPromotions}
                />
                <Box mt={3}>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item>
                      <a className={classes.helptext} href="https://mypharmasupport.zendesk.com/hc/pt-br">
                        Tem mais dúvidas <HelpOutline />{' '}
                      </a>
                    </Grid>
                    <Divider orientation="vertical" style={{ height: 20, alignSelf: 'center' }} flexItem />
                    <Grid item>
                      <a className={classes.infotext} href="https://mypharmasupport.zendesk.com/hc/pt-br">
                        Mais informações sobre Promoções <LaunchIcon />{' '}
                      </a>
                    </Grid>
                  </Grid>
                </Box>
              </React.Fragment>
            )
          }}
        </ProductPromotionConsumer>
      </ProductPromotionProvider>
    )
  }
}

export default withStyles(style)(MarketingPromotion)
