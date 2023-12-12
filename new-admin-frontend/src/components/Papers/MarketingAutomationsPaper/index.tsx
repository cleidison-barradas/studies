import React, { Component } from 'react'
import { Box, Button, FormControlLabel, Grid, Switch, Tooltip, Typography, withStyles } from '@material-ui/core'
import { Link, RouteComponentProps } from 'react-router-dom'
import { IMarketingAutomationRequest } from '../../../services/api/interfaces/ApiRequest'

import { InfoOutlined, FiberManualRecord } from '@material-ui/icons'
import MarketingAutomationForm from '../../Forms/MarketingAutomationForm'
import MarketingAutomations from '../../../interfaces/marketingAutomations'
import { Field, FieldProps, Form, Formik } from 'formik'
import PaperBlock from '../../PaperBlock'
// import Chart from './chart'
import { isEqual } from 'lodash'
import style from './style'
import * as yup from 'yup'

interface Props extends RouteComponentProps {
  classes: any
  mode: any
  automations: MarketingAutomations
  loadAutomations: () => void
  onSave: (data: IMarketingAutomationRequest) => void
}

class MarketingAutomationsPaper extends Component<Props> {
  onLoad = () => {
    const { loadAutomations } = this.props
    loadAutomations()
  }

  componentDidMount() {
    this.onLoad()
  }

  schemaValidate = yup.object({
    automations: yup.object().shape({
      _id: yup.string(),
      status: yup.boolean(),
      MISS_YOU_15: yup.boolean(),
      MISS_YOU_20: yup.boolean(),
      MISS_YOU_30: yup.boolean(),
      RECENT_CART: yup.boolean(),
    }),
  })

  render() {
    const { classes, automations, onSave } = this.props

    return (
      <Box>
        <Formik initialValues={{ automations }} onSubmit={onSave} enableReinitialize>
          {({ values, initialValues }) => (
            <Form>
              <Grid container justify="space-between" alignItems="center">
                <Typography className={classes.headertxt}>Automações de Marketing</Typography>
                <Button disabled={isEqual(initialValues, values)} color="primary" type="submit" variant="contained">
                  Salvar
                </Button>
              </Grid>
              <Grid container spacing={4}>
                <Grid item lg={8} md={8} sm={12} xs={12}>
                  <Box>
                    <Box mb={2} mt={3}>
                      <Typography className={classes.sectiontitle}>Vendas</Typography>
                    </Box>
                    <Grid container spacing={2}>
                      <MarketingAutomationForm />
                    </Grid>
                  </Box>
                </Grid>
                <Grid item lg={4} md={4} sm={12} xs={12}>
                  <Box mt={window.innerWidth > 959 ? 9 : 0}>
                    <PaperBlock title="Status da automação">
                      <Field
                        name="automations.status"
                        render={({ form, field }: FieldProps) => {
                          return (
                            <FormControlLabel
                              label={
                                <Tooltip
                                  title={automations.status ? ' Desativar todas as automações' : ' Ativar todas as automações'}
                                >
                                  <Typography>
                                    {automations.status ? ' Desativar todas as automações' : ' Ativar todas as automações'}{' '}
                                    <InfoOutlined />{' '}
                                  </Typography>
                                </Tooltip>
                              }
                              control={
                                <Switch
                                  color="default"
                                  checked={field.value}
                                  onChange={(event: any, checked: boolean) => {
                                    if (checked) {
                                      form.setFieldValue('automations.status', true)
                                      form.setFieldValue('automations.RECENT_CART', true)
                                      form.setFieldValue('automations.MISS_YOU_15', true)
                                      form.setFieldValue('automations.MISS_YOU_20', true)
                                      form.setFieldValue('automations.MISS_YOU_30', true)
                                    } else {
                                      form.setFieldValue('automations.status', false)
                                      form.setFieldValue('automations.RECENT_CART', false)
                                      form.setFieldValue('automations.MISS_YOU_15', false)
                                      form.setFieldValue('automations.MISS_YOU_20', false)
                                      form.setFieldValue('automations.MISS_YOU_30', false)
                                    }
                                  }}
                                />
                              }
                            />
                          )
                        }}
                      />

                      <Box mb={2} mt={2}>
                        <Typography className={classes.channel}>canais de disparos</Typography>
                      </Box>

                      <Grid container spacing={2} alignItems="center">
                        <Grid item>
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item>
                              {automations.status ? (
                                <FiberManualRecord htmlColor="#58CFB2" fontSize="small" />
                              ) : (
                                <FiberManualRecord color="error" fontSize="small" />
                              )}
                            </Grid>
                            <Grid item>
                              <Typography className={classes.channeltext}>E-mail Marketing</Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </PaperBlock>
                  </Box>
                  <div>
                    <PaperBlock title="Disparos em Massa">
                      <Typography>Enviar e-mail para toda sua base de clientes</Typography>
                      <Box mt={3}>
                        <Link className={classes.linkbtn} to="/marketing/automations/email">
                          Criar e-mail
                        </Link>
                      </Box>
                    </PaperBlock>
                  </div>
                  {/* <div>
                    <PaperBlock title="Visualização dos disparos">
                      <Box mb={4}>
                        <Divider />
                      </Box>
                      <Chip
                        classes={{
                          root: classes.chipprimary,
                        }}
                        label="Email Marketing"
                      />
                      <Box mt={3}>
                        <Chart />
                      </Box>
                    </PaperBlock>
                  </div> */}
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    )
  }
}

export default withStyles(style)(MarketingAutomationsPaper)
