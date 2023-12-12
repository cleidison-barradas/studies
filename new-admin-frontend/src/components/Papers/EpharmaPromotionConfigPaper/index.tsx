import React, { Component } from "react"
import { Box, Button, Grid, Typography, withStyles } from "@material-ui/core"
import { Form, Formik } from "formik"
import * as yup from 'yup'

import PaperBlock from "../../PaperBlock"
import SuportLink from "../../SuportLink"
import EpharmaPromotionConfigForm from "../../Forms/EpharmaPromotionConfigForm"


import style from './style'
import Store from "../../../interfaces/store"
import { EpharmaRequest } from "../../../services/api/interfaces/ApiRequest"

interface Props {
  store?: Store | null
  loadStore: () => Promise<void>
  onSave: (data: EpharmaRequest) => void
  classes: Record<keyof ReturnType<typeof style>, string>
}

class EpharmaPromotionConfigPaper extends Component<Props> {

  schemaValidate = yup.object({
    config_epharma_clientId: yup.string().required('client_id é obrigatório').nullable(true),
    config_epharma_password: yup.string().required('senha é obrigatório').nullable(true),
    config_epharma_username: yup.string().required('usuário é obrigatório').nullable(true)
  })

  async componentDidMount() {
    const { loadStore } = this.props

    await loadStore()
  }

  render() {
    const { classes, store, onSave } = this.props

    return (

      <Formik
        initialValues={{
          config_epharma_clientId: store ? store.settings['config_epharma_clientId']! : '',
          config_epharma_username: store ? store.settings['config_epharma_username']! : '',
          config_epharma_password: store ? store.settings['config_epharma_password']! : ''

        }}
        onSubmit={onSave}
        validationSchema={this.schemaValidate}
        enableReinitialize
      >
        {({ isValid, isSubmitting }) => (
          <Form>
            <Box>
              <Box mb={3}>
                <Grid container justify="space-between" alignItems="center" >
                  <Grid item>
                    <Typography className={classes.headertxt}>Promoções Epharma</Typography>
                  </Grid>
                </Grid>
              </Box>
              <PaperBlock title="Credenciais de acesso">
                <EpharmaPromotionConfigForm />
                <SuportLink query="integracões-epharma" />
              </PaperBlock>
              <Button color="primary" variant="contained" type="submit" disabled={!isValid || isSubmitting} >Salvar</Button>
            </Box>
          </Form>
        )}
      </Formik>
    )
  }
}

export default withStyles(style)(EpharmaPromotionConfigPaper)