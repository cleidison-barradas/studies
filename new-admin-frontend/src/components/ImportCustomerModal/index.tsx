import { Component } from 'react'
import { FormikErrors } from 'formik'
import { Box, Button, Grid, Typography, withStyles } from '@material-ui/core'
import CustomDialog from '../CustomDialog'
import ImportCustomerModalContent from '../ImportCustomerModalContent'
import { ReactComponent as GoToIcon } from '../../assets/images/blueGoTo.svg'

import styles from './styles'
import Plan from '../../interfaces/plan'

type Props = {
  open: boolean
  closeModal: () => void
  plan: Plan
  errors: FormikErrors<any>
  handleSubmit: () => Promise<void>
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class ImportCustomerModal extends Component<Props> {
  static defaultProps = {
    open: false,
    isValid: false,
  }

  _renderContent = () => {
    const { errors, plan } = this.props

    return <ImportCustomerModalContent plan={plan} errors={errors} />
  }

  _renderFooter = () => {
    const { classes, handleSubmit, closeModal } = this.props

    return (
      <Grid container justify="space-between">
        <Grid item>
          <Box mt={1}>
            <a
              href={'https://mypharmasupport.zendesk.com/hc/pt-br/search?utf8=%E2%9C%93&query=importador+de+clientes'}
              target="_blank"
              rel="noopener noreferrer"
              className={classes.link}
            >
              <GoToIcon fill={'#ccc'} />
              <Typography color="inherit">Precisa de ajuda?</Typography>
            </a>
          </Box>
        </Grid>
        <Grid item>
          <Grid container spacing={2} style={{ padding: '5px 12px' }}>
            <Grid item>
              <Button variant="outlined" onClick={closeModal}>
                CANCELAR
              </Button>
            </Grid>
            <Grid item>
              <Button
                color="primary"
                variant="contained"
                onClick={async () => {
                  await handleSubmit()
                }}
              >
                SALVAR
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }

  render() {
    const { open, closeModal } = this.props

    return (
      <CustomDialog
        open={open}
        title="Importar clientes"
        closeModal={closeModal}
        footer={this._renderFooter}
        content={this._renderContent}
      />
    )
  }
}

export default withStyles(styles)(ImportCustomerModal)
