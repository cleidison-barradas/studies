import { Box, Button, CircularProgress, Typography, withStyles } from '@material-ui/core'
import { CloudDownload, FileCopy } from '@material-ui/icons'
import { Component } from 'react'
import BillSvg from '../../../assets/images/ilustration/Bill.svg'
import FinancialContext from '../../../context/FinancialContext'
import { fDate } from '../../../helpers/format-date'
import { floatToBRL } from '../../../helpers/moneyFormat'
import PaperBlock from '../../PaperBlock'
import styles from './styles'

interface Props {
  classes: Record<keyof ReturnType<typeof styles>, string>
  openSnackbar: (message: string, severity?: 'error' | 'info' | 'success' | 'warning' | undefined) => void
}

class InvoicePending extends Component<Props> {
  static contextType = FinancialContext
  context!: React.ContextType<typeof FinancialContext>

  state = {
    isLoading: false,
    numberInvoice: undefined,
  }

  async downloadInvoice(numberInvoice: number) {
    const { printInvoice } = this.context

    try {
      this.setState({
        isLoading: true,
        numberInvoice,
      })
      await printInvoice(numberInvoice)
      this.props.openSnackbar('Download da fatura realizada com sucesso.', 'success')
      this.setState({
        isLoading: false,
        numberInvoice: undefined,
      })
    } catch (error) {
      this.props.openSnackbar('Erro ao realizar o download da fatura', 'error')
      this.setState({
        isLoading: false,
        numberInvoice: undefined,
      })
    }
  }

  copyTextToClipboard = (text: string): void => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        this.props.openSnackbar('Código de barras copiado', 'info')
      })
      .catch((error) => {
        this.props.openSnackbar('Erro ao copiar o código de barras', 'error')
      })
  }

  render() {
    const { invoices } = this.context
    const { classes } = this.props
    const lastIndex = invoices && invoices.length - 1

    return (
      <PaperBlock title="Boleto eletrônico">
        {invoices && invoices.length > 0 ? (
          <>
            <Box mb={3}>
              <Typography>
                Abaixo estão listados todos os boletos em aberto. Para copiar o código de barras, clique sobre ele. Se preferir,
                você pode emitir a fatura do boleto clicando no botão "Emitir Boleto". Após o pagamento boleto possui um prazo de
                compensação de até 72 horas, ou seja, 3 dias úteis para ser confirmado pelo banco. Não é possível emitir o boleto
                ou copiar o código de barras de boletos vencidos há mais de 60 dias. Para resolver esse problema, pedimos que você
                entre em contato conosco enviando um e-mail para financeiro@mypharma.net.br.
              </Typography>
            </Box>

            {invoices.slice(0, 12).map((invoice, index) => (
              <Box key={invoice.idCliente}>
                <Box className={classes.boxContent}>
                  <Typography>
                    Vencimento: <span className={classes.span}>{fDate(invoice.dataVencimento)}</span>
                  </Typography>
                  <Typography>
                    Valor: <span className={classes.span}>{floatToBRL(invoice.valor)}</span>
                  </Typography>
                  <Button
                    variant="contained"
                    disabled={invoice.faturaVencidaMaisDe60Dias}
                    color="primary"
                    type="submit"
                    onClick={() => this.copyTextToClipboard(invoice.linhaDigitavel)}
                    className={classes.button}
                  >
                    <Box style={{ display: 'flex', gap: '8px' }}>
                      <FileCopy />
                      CÓDIGO DE BARRAS
                    </Box>
                  </Button>

                  <span className={classes.label}>ABERTO</span>

                  {this.state.isLoading && this.state.numberInvoice === invoice.idCobranca ? (
                    <Button variant="contained" className={classes.buttonDisabled} disabled color="primary">
                      <CircularProgress style={{ color: '#b3bcc2' }} size={24} />
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      className={classes.buttonInvoice}
                      disabled={invoice.faturaVencidaMaisDe60Dias}
                      color="primary"
                      type="submit"
                      onClick={() => this.downloadInvoice(invoice.idCobranca)}
                    >
                      <Box style={{ display: 'flex', gap: '8px' }}>
                        <CloudDownload />
                        BOLETO
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
                Sem boletos gerados
              </Typography>

              <Typography>Por favor, aguarde até o próximo mês para que a sua fatura seja disponibilizada.</Typography>
            </Box>
          </Box>
        )}
      </PaperBlock>
    )
  }
}

export default withStyles(styles)(InvoicePending)
