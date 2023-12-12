import { withStyles } from '@material-ui/styles'
import styles from './styles'
import { Box, Button, Grid, Tooltip, Typography } from '@material-ui/core'
import { Field, Form, Formik } from 'formik'
import CustomComponent from '../../CustomComponent'
import TextFormField from '../../TextFormField'
import PaperBlock from '../../PaperBlock'
import { InfoOutlined } from '@material-ui/icons'
import SuportLink from '../../SuportLink'

interface Props {
  classes: Record<keyof ReturnType<typeof styles>, string>
  externalIntegrationData: any
  getExternalIntegrationData: (integration: string) => any
  putExternalIntegrationData: (integration: string, externalIntegrationData: any) => any
}

class MarketingExternalIntegrationForm extends CustomComponent<Props> {
  onLoad = async () => {
    await this.props.getExternalIntegrationData("PLUGGTO")
  }

  async componentDidMount() {
    await this.onLoad()
  }

  handleSubmit = async(data: any) => {
    const externalIntegrationData = {externalIntegrationData: data}

    await this.props.putExternalIntegrationData("PLUGGTO", externalIntegrationData)
  }

  render() {
    const { classes } = this.props
      return (
        <div>
          <Formik
            onSubmit={this.handleSubmit}
            initialValues={
              this.props.externalIntegrationData ||
              {client_secret: "", client_id:"", username: "", password: ""}}
            enableReinitialize
          >
            {({ values, initialValues }) => {
              return (
                <Form>
                  <PaperBlock>
                  <Grid container alignItems="center">
                  <Typography className={classes.title}>Plugg.to [BETA]</Typography>
                    <Box ml={1}>
                      <Tooltip title="Esta integração está no estágio BETA, portanto, podem acontecer instabilidades nos primeiros clientes integrados. Contamos com sua compreensão.">
                        <InfoOutlined />
                      </Tooltip>
                    </Box>
                </Grid>
                  <Grid container spacing={3}>
                    <Grid item>
                      <Typography className={classes.caption}>
                        A integração com a Plugg.to possibilita a integração com centenas de marketplaces, como Amazon, Mercado Livre, Magazine Luíza e Rappi.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} lg={6} md={6}>
                      <Field
                        label="Client ID"
                        name="client_id"
                        className={classes.textfield}
                        variant="outlined"
                        component={TextFormField}
                        fullWidth
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} lg={6} md={6}>
                      <Field
                        label="Client Secret"
                        name="client_secret"
                        className={classes.textfield}
                        variant="outlined"
                        component={TextFormField}
                        fullWidth
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} lg={6} md={6}>
                      <Field
                        label="Password"
                        name="password"
                        className={classes.textfield}
                        variant="outlined"
                        component={TextFormField}
                        fullWidth
                        disabled={false}
                      />
                    </Grid>
                    <Grid item xs={12} lg={6} md={6}>
                      <Field
                        label="Username"
                        name="username"
                        className={classes.textfield}
                        variant="outlined"
                        component={TextFormField}
                        fullWidth
                        disabled={false}
                      />
                    </Grid>

                    <Grid item xs={12} lg={6} md={6}>
                      <Button variant="contained" color="primary" type="submit" disabled={false}>
                        Salvar
                      </Button>
                    </Grid>

                  </Grid>

                    <Grid container alignItems="center" spacing={4}>
                      <Grid item>
                        <SuportLink query="Como integrar com a Plugg.to" classes={classes} />
                      </Grid>
                    </Grid>
                  </PaperBlock>
                </Form>
              )
            }}
          </Formik>
        </div>
      )
    }
  }
export default withStyles(styles)(MarketingExternalIntegrationForm)
