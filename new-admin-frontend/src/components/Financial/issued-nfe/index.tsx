import { Box, Button, CircularProgress, Typography, withStyles } from '@material-ui/core'
import { CloudDownload } from '@material-ui/icons'
import { Component } from 'react'
import BillSvg from '../../../assets/images/ilustration/Bill.svg'
import FinancialContext from '../../../context/FinancialContext'
import { floatToBRL } from '../../../helpers/moneyFormat'
import PaperBlock from '../../PaperBlock'
import styles from './styles'

interface Props {
  classes: Record<keyof ReturnType<typeof styles>, string>
  openSnackbar: (message: string, severity?: 'error' | 'info' | 'success' | 'warning' | undefined) => void
}

class IssuedNfe extends Component<Props> {
  static contextType = FinancialContext
  context!: React.ContextType<typeof FinancialContext>

  state = {
    isLoading: false,
    invoiceId: undefined,
  }

  async downloadNfe(numberInvoice: number, invoiceId: number) {
    const { printNfe } = this.context

    try {
      this.setState({
        isLoading: true,
        invoiceId,
      })
      await printNfe(numberInvoice)
      this.props.openSnackbar('Download da nota fiscal realizada com sucesso.', 'success')
      this.setState({
        isLoading: false,
        invoiceId: undefined,
      })
    } catch (error) {
      this.props.openSnackbar('Erro ao emitir nota fiscal, entre em contato financeiro@mypharma.net.br.', 'error')
      this.setState({
        isLoading: false,
        invoiceId: undefined,
      })
    }
  }

  render() {
    const { nfes } = this.context
    const { classes } = this.props
    const lastIndex = nfes && nfes.length - 1

    return (
      <PaperBlock title="Nota fiscal eletrônica">
        {nfes && nfes.length > 0 ? (
          <>
            <Box mb={3}>
              <Typography>
                Abaixo estão listados todas as notas fiscais geradas nos últimos 12 meses. Você pode emitir a nota fiscal clicando
                no botão "Emitir nota fiscal". Caso necessite uma nota fiscal que não se encontre lista abaixo ou que ocorra algum
                erro para emitir, envie um e-mail para financeiro@mypharma.net.br.
              </Typography>
            </Box>

            {nfes.slice(0, 12).map((nfe, index) => (
              <Box key={nfe.idCliente}>
                <Box className={classes.boxContent}>
                  <Typography>
                    Competência: <span className={classes.span}>{nfe.competencia}</span>
                  </Typography>

                  <Typography>
                    Parcela: <span className={classes.span}>n° {nfe.numeroParcela}</span>
                  </Typography>

                  <Typography>
                    Valor: <span className={classes.span}>{floatToBRL(nfe.valor)}</span>
                  </Typography>

                  <span className={classes.label}>PAGO</span>

                  {this.state.isLoading && this.state.invoiceId === nfe.idCobranca ? (
                    <Button variant="contained" className={classes.buttonDisabled} disabled color="primary">
                      <CircularProgress style={{ color: '#b3bcc2' }} size={24} />
                    </Button>
                  ) : (
                    <Button
                      className={classes.buttonNfe}
                      variant="contained"
                      color="primary"
                      type="submit"
                      onClick={() => this.downloadNfe(nfe.numeroTitulo, nfe.idCobranca)}
                    >
                      <Box style={{ display: 'flex', gap: '8px' }}>
                        <CloudDownload />
                        NOTA FISCAL
                      </Box>
                    </Button>
                  )}
                </Box>
                {index !== lastIndex && <div className={classes.divider} />}
              </Box>
            ))}
          </>
        ) : (
          <Box className={classes.box}>
            <img src={BillSvg} alt="Sem boletos gerados" />

            <Box className={classes.boxContentText}>
              <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                Sem notas fiscais geradas
              </Typography>

              <Typography>Até o momento presente, nenhuma nota fiscal foi emitida para você.</Typography>
            </Box>
          </Box>
        )}
      </PaperBlock>
    )
  }
}

export default withStyles(styles)(IssuedNfe)
