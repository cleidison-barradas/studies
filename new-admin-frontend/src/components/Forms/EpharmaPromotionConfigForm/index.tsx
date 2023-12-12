import { Box, Grid, withStyles } from "@material-ui/core"
import { Field } from "formik"
import { Component } from "react"
import TextFormField from "../../TextFormField"
import style from './style'

interface Props {
  classes: Record<keyof ReturnType<typeof style>, string>
}

class EpharmaPromotoinConfigForm extends Component<Props> {

  render() {
    const { classes } = this.props

    return (
      <Box mb={3}>
        <Grid container spacing={3} >
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <Field
              name="config_epharma_clientId"
              label="Client_Id"
              autoComplete="off"
              component={TextFormField}
              classes={{
                root: classes.input
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <Field
              name="config_epharma_username"
              label="Usuário"
              autoComplete="off"
              component={TextFormField}
              classes={{
                root: classes.input
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <Field
              name="config_epharma_password"
              label="Senha"
              autoComplete="off"
              component={TextFormField}
              classes={{
                root: classes.input
              }}
            />
          </Grid>
        </Grid>
      </Box>
    )
  }
}


export default withStyles(style)(EpharmaPromotoinConfigForm)