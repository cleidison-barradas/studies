
import React, { BaseSyntheticEvent, Component } from 'react'
import styles from './styles'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, withStyles } from '@material-ui/core'
import { IFoodReport } from '../../../interfaces/ifood'
import { BucketS3 } from '../../../config'

  interface Props {
    classes: Record<keyof ReturnType<typeof styles>, string>
    open: boolean
    setOpen: (open: boolean) => void
    ifoodReports?: IFoodReport[]
    requestiFoodReports: () => Promise<void>
  }

  interface State {
      reportMonth?: string
  }

  class ExportIFoodOrderDialog extends Component<Props, State> {
    state: State = {
        reportMonth: ''
    }

    componentDidMount() {
        const { requestiFoodReports } = this.props
        requestiFoodReports()
    }
    handleChange = (event: BaseSyntheticEvent) => {
        this.setState({
          ...this.state,
          reportMonth: event.target.value
        })
    }

    render() {
      const { open, setOpen, ifoodReports } = this.props
      const { reportMonth } = this.state
      return (
        <Dialog open={open} onBackdropClick={() => setOpen(false)} fullWidth maxWidth="sm">
            <DialogTitle>Exportar pedidos do iFood</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Selecione o mês do qual você gostaria de emitir um relatório.
                <br />
                Lembrando que estão disponíveis relatórios a partir do mês de Dezembro de 2021 e todos os relatórios compreendem do primeiro ao último dia do mês.
                <br />
                Novos relatórios são gerados no último dia do mês.
              </DialogContentText>
              <FormControl fullWidth>
                <InputLabel id="ifood-report-select-label">Mês</InputLabel>
                <Select
                  labelId="ifood-report-select-label"
                  value={reportMonth}
                  onChange={this.handleChange}
                  label="Mês"
                >
                  {ifoodReports?.map(({label, value}, idx) => (
                    <MenuItem value={value} key={idx}>{label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button
                disabled={reportMonth === "" || !reportMonth}
                type="submit"
                variant="contained"
                color="primary"
              >
                <a style={{textDecoration: 'none', color: '#FFF'}} href={`${BucketS3}${reportMonth}`} target="_blank" rel="noopener noreferrer">Baixar</a>
              </Button>
            </DialogActions>
          </Dialog>
      )
    }
  }

export default withStyles(styles)(ExportIFoodOrderDialog)