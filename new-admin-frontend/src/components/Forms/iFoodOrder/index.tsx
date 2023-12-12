import { Box, Button, Grid, IconButton, LinearProgress, Typography, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import style from './style'
import { ReactComponent as BlueBackIcon } from '../../../assets/images/icons/blueBackArrow.svg'
import IFoodPaper from '../../Papers/iFoodPaper'
import CustomDialog from '../../CustomDialog'
import CustomDialogiFood from '../../CustomDialogiFood'
import { OrderConsumer } from '../../../context/OrderContext'

type Props = {
  classes: any
  mode: any
  orderCod: any
  orderId: any
  history: any
  fetching: any
  loadiFoodOrderDetail: (...args: any) => void
  deleteOrder: (...args: any) => void
}

type State = {
  modal: {
    open: boolean
    footer: any
    title: any
    dividers?: boolean
  }
}

type Modal = {
  open: boolean
  title: any
  footer: any
  dividers: false
}

class IFoodOrder extends Component<Props, State> {
  constructor(props: any) {
    super(props)

    this.state = {
      modal: {
        open: false,
        footer: '',
        title: '',
        dividers: false,
      },
    }
  }

  closeModal = () => {
    this.setState((state: any) => ({
      ...state,
      modal: {
        open: false,
      },
    }))
  }

  handleOpenModal = () => {
    const modal: Modal = {
      open: true,
      title: 'Finalizar pedido',
      footer: null,
      dividers: false,
    }

    this.setState({
      modal,
    })
  }

  onLoad = async () => {
    const { orderCod, loadiFoodOrderDetail } = this.props

    if (orderCod) {
      loadiFoodOrderDetail(orderCod)
    }
  }

  componentDidMount() {
    this.onLoad()
  }

  handleSubmit = () => {
    const { orderId, deleteOrder, history } = this.props
    if (orderId) {
      deleteOrder(orderId)
    }
    setTimeout(() => {
      this.onLoad()
      this.closeModal()
      history.push('/ifood/list')
    }, 500)
  }

  render() {
    const { classes, orderId, history, mode, fetching } = this.props
    const {
      modal: { open, title, footer },
    } = this.state
    return (
      <OrderConsumer>
        {({ ifoodOrder }) => (
          <React.Fragment>
            <Box mb={3}>
              <Grid container alignItems="center" justify="space-between">
                <Grid item>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                      <IconButton
                        classes={{
                          root: classes.gobackbtn,
                        }}
                        onClick={() => history.goBack()}
                      >
                        <BlueBackIcon />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <Typography className={classes.headertxt}>Pedido ({orderId})</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid container xl={4} lg={5} md={12} sm={12} xs={12} justify={window.innerWidth > 1200 ? 'flex-end' : 'flex-start'}>
                  {ifoodOrder?.status !== "FIN" && ifoodOrder?.status !== "CAN" && (
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          this.handleOpenModal()
                        }}
                      >
                        Finalizar pedido
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Box>
            {fetching && (
              <Box mb={3}>
                <LinearProgress />
              </Box>
            )}
            <IFoodPaper mode={mode} ifoodOrder={ifoodOrder} />
            {open ? (
              <CustomDialog
                open={open}
                footer={footer}
                dividers={false}
                title={title}
                paperWidthSm={classes.paperWidthSm}
           closeModal={() => { /** */ }}

                content={() => <CustomDialogiFood closeModal={this.closeModal} onSave={this.handleSubmit} />}
              />
            ) : null}
          </React.Fragment>
        )}
      </OrderConsumer>
    )
  }
}

export default withStyles(style)(IFoodOrder)
