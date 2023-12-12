import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, withStyles } from '@material-ui/core'
import moment from 'moment'
import React, { Component } from 'react'
import Cart from '../../interfaces/cart'
import PaymentLink from '../../interfaces/paymentLink'
import PaymentLinkInformationsResponse from '../../interfaces/paymentLinkInformationsResponse'
import CustomDialog from '../CustomDialog'
import LinkCell from '../LinkCell'
import TimerCount from '../TimerCount'
import style from './style'

type Props = {
  classes: any
  open: boolean
  onClose: () => void
  getCartByPaymentLink: (...args: any) => Promise<PaymentLinkInformationsResponse>
  paymentLinkId: string
}
type State = {
  cart: Cart | undefined
  paymentLink: PaymentLink | undefined
}

class CustomDialogViewPaymentLink extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      cart: undefined,
      paymentLink: undefined,
    }
  }

  componentDidUpdate() {
    const { paymentLink } = this.state
    const { paymentLinkId } = this.props
    if (this.props.open && paymentLink?._id !== paymentLinkId) this.renderContent()
  }

  async renderContent() {
    const { getCartByPaymentLink, paymentLinkId } = this.props
    const state = await getCartByPaymentLink(paymentLinkId)
    this.setState(state)
  }

  Content() {
    const { classes } = this.props
    const { cart, paymentLink } = this.state
    const expirationDate = paymentLink ? moment(paymentLink.createdAt).add(27, 'hours').toDate() : null
    return (
      <>
        {paymentLink && (
          <Box className={classes.contentBox}>
            <Box mb={2}>
              {(expirationDate as Date).getTime() - new Date().getTime() > 0 ? (
                <Typography variant="body2" className={classes.expirationCount}>
                  Link expira em <TimerCount time={expirationDate} />
                </Typography>
              ) : (
                <Typography variant="body2" className={classes.expiredLink}>
                  Link expirado
                </Typography>
              )}
            </Box>
            <Box className={classes.informationsBox}>
              <LinkCell link={paymentLink.link} />
              <Box className={classes.informationsBox}>
                <Box>
                  <TableContainer>
                    <Table
                      style={{
                        minWidth: '100%',
                        marginTop: '0',
                      }}
                    >
                      <TableHead>
                        <TableRow
                          classes={{
                            root: classes.tablerow,
                          }}
                        >
                          <TableCell
                            classes={{
                              root: classes.tablecell,
                            }}
                            width="auto"
                          >
                            Nome
                          </TableCell>
                          <TableCell
                            classes={{
                              root: classes.tablecell,
                            }}
                            width="20%"
                          >
                            Quantidade
                          </TableCell>
                          <TableCell
                            classes={{
                              root: classes.tablecell,
                            }}
                            width="30%"
                          >
                            Preço unitário
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {cart?.products.map(({ product, quantity }) => (
                          <TableRow key={product._id}>
                            <TableCell
                              classes={{
                                root: classes.tablecellbody,
                              }}
                            >
                              <Box>
                                <Typography variant="body2">{product.name}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell
                              classes={{
                                root: classes.tablecellbody,
                              }}
                            >
                              {quantity}
                            </TableCell>

                            <TableCell
                              classes={{
                                root: classes.tablecellbody,
                              }}
                            >
                              {`R$ ${product.price.toFixed(2).replace('.', ',')}`}
                            </TableCell>
                          </TableRow>
                        ))}
                        {paymentLink?.deliveryFee !== undefined ? (
                          <TableRow>
                            <TableCell
                              classes={{
                                root: classes.tablecellbody,
                              }}
                            >
                              <Box>
                                <Typography variant="body2">Taxa de entrega</Typography>
                              </Box>
                            </TableCell>
                            <TableCell
                              classes={{
                                root: classes.tablecellbody,
                              }}
                            />

                            <TableCell
                              classes={{
                                root: classes.tablecellbody,
                              }}
                            >
                              {`R$ ${(paymentLink?.deliveryFee as number).toFixed(2).replace('.', ',')}`}
                            </TableCell>
                          </TableRow>
                        ) : null}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </>
    )
  }

  render() {
    const { open, onClose } = this.props

    return <CustomDialog open={open} closeModal={onClose} title="Link de Pagamento" content={() => this.Content()} />
  }
}

export default withStyles(style)(CustomDialogViewPaymentLink)
