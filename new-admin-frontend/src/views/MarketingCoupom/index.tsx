import { Box, Button, Grid, Typography, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import MarketingCoupomPaper from '../../components/Papers/MarketingCoupomPaper'
import NewCupomDialog from '../../components/Dialogs/DialogCupom'
import style from './style'
import { CupomConsumer, CupomProvider } from '../../context/CupomContext'
import { CategoryConsumer, CategoryProvider } from '../../context/CategoryContext'
import { ProductConsumer, ProductProvider } from '../../context/ProductContext'
import customerxService from '../../services/customerx.service'

type Props = {
  classes: any
  mode: any
}

type State = {
  modal: boolean
}

class MarketingCoupom extends Component<Props, State> {
  constructor(props: any) {
    super(props)

    this.state = {
      modal: false,
    }
    this.changeModal = this.changeModal.bind(this)
  }

  componentDidMount() {
    customerxService.trackingScreen()
  }

  changeModal() {
    this.setState({
      ...this.state,
      modal: !this.state.modal,
    })
  }

  render() {
    const { classes, mode } = this.props
    const { modal } = this.state
    return (
      <CupomProvider>
        <CupomConsumer>
          {({ cupoms, getCupoms, fetching, deleteCupom, pagination, postCupom, putCupom, success }) => (
            <>
              <Box mb={2}>
                <Grid container justify="space-between" alignItems="center">
                  <Grid item>
                    <Typography className={classes.title}>Cupons</Typography>
                  </Grid>
                  <Grid item>
                    <Button color="primary" variant="contained" onClick={this.changeModal}>
                      Criar cupom
                    </Button>
                  </Grid>
                </Grid>
              </Box>
              <MarketingCoupomPaper
                mode={mode}
                postCupom={postCupom}
                cupoms={cupoms}
                deleteCupom={deleteCupom}
                fetching={fetching}
                getCupoms={getCupoms}
                count={pagination?.total}
                changeModal={this.changeModal}
              />
              <ProductProvider>
                <ProductConsumer>
                  {({ getProducts, products, fetching: fetchingProducts }) => (
                    <CategoryProvider>
                      <CategoryConsumer>
                        {({ getCategorys, categorys }) => (
                          <NewCupomDialog
                            success={success}
                            changeModal={this.changeModal}
                            open={modal}
                            getCupoms={getCupoms}
                            fetching={fetching}
                            getCategorys={getCategorys}
                            categorys={categorys}
                            addCupom={putCupom}
                            getProducts={getProducts}
                            products={products}
                            fetchingProducts={fetchingProducts}
                          />
                        )}
                      </CategoryConsumer>
                    </CategoryProvider>
                  )}
                </ProductConsumer>
              </ProductProvider>
            </>
          )}
        </CupomConsumer>
      </CupomProvider>
    )
  }
}

export default withStyles(style)(MarketingCoupom)
