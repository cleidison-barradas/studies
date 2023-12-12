import { Box, Divider, Grid, Typography, Input, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import PaperBlock from '../../PaperBlock'

import style from './style'
import { ReactComponent as BlueHouse } from '../../../assets/images/icons/blueHouse.svg'
import { ReactComponent as BlueCalendar } from '../../../assets/images/icons/blueCalendar.svg'
import { ReactComponent as BlueCard } from '../../../assets/images/icons/blueCard.svg'
import { ReactComponent as BlueUser } from '../../../assets/images/icons/blueUser.svg'
import { ReactComponent as BlueMail } from '../../../assets/images/icons/blueMail.svg'
import { ReactComponent as BluePhone } from '../../../assets/images/icons/bluePhone.svg'

import IFoodOrderProductsTable from '../../Tables/iFoodOrderProductsTable'
import { floatToBRL } from '../../../helpers/moneyFormat'
import InputMasked from 'react-input-mask'
import moment from 'moment'
import { IFoodDetail } from '../../../interfaces/ifood'

type Props = {
  classes: any
  mode: any
  ifoodOrder: IFoodDetail | null
}

class IFoodPaper extends Component<Props> {
  render() {
    const { classes, ifoodOrder } = this.props

    return (
      <React.Fragment>
        <Grid container spacing={4}>
          <Grid item lg={8} md={8} sm={12} xs={12}>
            <div>
              <PaperBlock title="Informações do pedido">
                <Box mb={1}>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item>
                      <BlueHouse />
                    </Grid>
                    <Grid item>
                      <Typography>{ifoodOrder?.loja.nome}</Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Box mb={1}>
                  <Grid container spacing={2}>
                    <Grid item>
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item>
                          <BlueCalendar />
                        </Grid>
                        <Grid item>
                          <Typography>{moment(ifoodOrder?.dataHora).calendar()}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
                <Grid container alignItems="center" spacing={1}>
                  {ifoodOrder &&
                    ifoodOrder.pagamentos.map((payment, idx) => (
                      <React.Fragment key={idx}>
                        <Grid item>
                          <BlueCard />
                        </Grid>
                        <Grid item>
                          {payment.nome === 'Dinheiro' && !ifoodOrder.entrega ? (
                            <Typography>
                              {payment.nome}, Valor para troco: {floatToBRL(ifoodOrder.valorTroco)}
                            </Typography>
                          ) : (
                            <Typography>{payment.nome}</Typography>
                          )}
                        </Grid>
                      </React.Fragment>
                    ))}
                  <Grid container alignItems="center" spacing={1}>
                    {ifoodOrder?.cliente.cpf && (
                      <React.Fragment>
                        <Grid item>
                          <BlueUser />
                        </Grid>
                        <Grid item>
                          <InputMasked mask="999.999.999-99" value={ifoodOrder.cliente.cpf} disabled>
                            {(props: any) => (
                              <Input {...props} type="tel" classes={{ root: classes.cpfInput }} disableUnderline />
                            )}
                          </InputMasked>
                        </Grid>
                      </React.Fragment>
                    )}
                  </Grid>
                </Grid>
              </PaperBlock>
            </div>
            <div>
              <PaperBlock title="Endereços de entrega">
                <Grid container spacing={1}>
                  <Grid item>
                    <Grid container spacing={1} />
                  </Grid>
                  <Grid item>
                    {!ifoodOrder?.entrega ? (
                      <Typography>RETIRAR NA LOJA</Typography>
                    ) : ifoodOrder.enderecoEntrega ? (
                      <Typography>
                        {ifoodOrder.enderecoEntrega.logradouro} {ifoodOrder.enderecoEntrega.numero}{' '}
                        {ifoodOrder.enderecoEntrega.complemento} {ifoodOrder.enderecoEntrega.bairro}
                      </Typography>
                    ) : (
                      <Typography>Endereco não Informado</Typography>
                    )}
                  </Grid>
                </Grid>
              </PaperBlock>
            </div>
            <div>
              <PaperBlock title="Produto">
                <IFoodOrderProductsTable products={ifoodOrder?.items} />
                {ifoodOrder && (
                  <React.Fragment>
                    <Box mt={1} mb={2}>
                      <Divider />
                    </Box>
                    <Box mb={2}>
                      <Grid container justify="space-between">
                        <Grid item>
                          <Typography className={classes.title}>Sub-total</Typography>
                        </Grid>
                        <Grid item>
                          <Typography className={classes.value}>{floatToBRL(ifoodOrder.valorMercado)}</Typography>
                        </Grid>
                      </Grid>
                    </Box>
                    <Box mb={2}>
                      <Grid container justify="space-between">
                        <Grid item>
                          <Typography className={classes.title}>Frete + Taxas</Typography>
                        </Grid>
                        <Grid item>
                          <Typography className={classes.value}>
                            {floatToBRL(ifoodOrder.valorEntrega + ifoodOrder.valorConveniencia)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                    <Box>
                      <Grid container justify="space-between">
                        <Grid item>
                          <Typography className={classes.title}>Total</Typography>
                        </Grid>
                        <Grid item>
                          <Typography className={classes.value}>{floatToBRL(ifoodOrder.valorTotal)}</Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </React.Fragment>
                )}
              </PaperBlock>
            </div>
          </Grid>
          <Grid item lg={4} md={4} sm={12} xs={12}>
            <div>
              <PaperBlock title="Informações do cliente">
                <Box mb={1}>
                  <Grid container spacing={1}>
                    <Grid item>
                      <BlueUser />
                    </Grid>
                    <Grid item>
                      <Typography>{ifoodOrder?.cliente.nome}</Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Box mb={1}>
                  <Grid container spacing={1}>
                    <Grid item>
                      <BlueMail />
                    </Grid>
                    <Grid item>
                      <Typography>{ifoodOrder?.cliente.email}</Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Grid container spacing={1}>
                  <Grid item>
                    <BluePhone />
                  </Grid>
                  <Grid item>
                    <Typography>{ifoodOrder?.cliente.telefoneCelular}</Typography>
                  </Grid>
                </Grid>
              </PaperBlock>
            </div>
          </Grid>
        </Grid>
      </React.Fragment>
    )
  }
}

export default withStyles(style)(IFoodPaper)
