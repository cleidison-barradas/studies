import React from 'react'
import styles from './styles'
import TextFormField from '../../TextFormField'
import PaperBlock from '../../PaperBlock'

import { Box, Divider, FormControl, Grid, Tooltip, Typography, withStyles } from '@material-ui/core'
import { InfoOutlined } from '@material-ui/icons'
import integrations from './integration.json'
import { Field } from 'formik'
import StoreSettings from '../../../interfaces/storeSettings'
import SuportLink from '../../SuportLink'
import CustomComponent from '../../CustomComponent'
import AreaNotAllowed from '../../AreaNotAllowed'
import Plan from '../../../interfaces/plan'
import { IntegrationStatus } from './components/integrationStatus'

type Props = {
  classes: any
  plan?: Plan
  fetching: any
  mode: string
  values: StoreSettings
  settings: any
}

class MarketingIntegrationForm extends CustomComponent<Props> {
  getIntegrationsByPlan(plan?: Plan) {
    const planIntegrations = {
      institutional: integrations.filter(({ inputName }) =>
        ['config_analytics_id', 'config_pixel_id', 'config_google_tag_manager_id', 'config_tawk_embed'].includes(
          inputName as string
        )
      ),
      pro: integrations,
      'pro-generic': integrations,
      start: integrations,
      enterprise: integrations,
    } as { [plan: Plan['rule']]: typeof integrations }

    return planIntegrations[plan?.rule || 'pro']
  }

  render() {
    const { classes, values, plan, settings } = this.props

    const hasCourierOrBestShipping = () => {
      return settings.config_best_shipping || settings.config_shipping_courier
    }

    const styledA = {
      textDecoration: 'none',
    }

    return (
      <React.Fragment>
        {(this.getIntegrationsByPlan(plan) || integrations).map((integration: any) => {
          if (integration.requires && !hasCourierOrBestShipping()) {
            return (
              <div key={integration.name}>
                <PaperBlock>
                  <Grid container alignItems="center">
                    <Typography className={classes.title}>{integration.name}</Typography>
                    {integration.description && (
                      <Box ml={1}>
                        <Tooltip title={integration.description}>
                          <InfoOutlined />
                        </Tooltip>
                      </Box>
                    )}
                  </Grid>
                  <Box mt={2}>
                    <Typography className={classes.helpertext}> {integration.helpertext} </Typography>
                    <Typography className={classes.caption}>
                      {' '}
                      Você não pode utilizar esta integração de produtos pois é necessário ter habilitado antes a integração com{' '}
                      <a
                        style={styledA}
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://mypharmasupport.zendesk.com/hc/pt-br/search?utf8=%E2%9C%93&query=correios"
                      >
                        Correios
                      </a>{' '}
                      ou{' '}
                      <a
                        style={styledA}
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://mypharmasupport.zendesk.com/hc/pt-br/search?utf8=%E2%9C%93&query=melhor+envio"
                      >
                        Melhor Envio
                      </a>
                    </Typography>
                    {integration.helpfooter !== false ? (
                      <Grid container alignItems="center" spacing={4}>
                        <Grid item>
                          <SuportLink query={integration.name} classes={classes} />
                        </Grid>
                      </Grid>
                    ) : (
                      ''
                    )}
                  </Box>
                </PaperBlock>
              </div>
            )
          }
          if (integration.inputName === 'cliquefarma') {
            return (
              <div key={integration.name}>
                <PaperBlock>
                  <Grid container alignItems="center">
                    <Typography className={classes.title}>{integration.name}</Typography>
                    {integration.description && (
                      <Box ml={1}>
                        <Tooltip title={integration.description}>
                          <InfoOutlined />
                        </Tooltip>
                      </Box>
                    )}
                  </Grid>
                  {this.canSeeComponent(['enterprise', 'pro', 'pro-generic'], plan) ? (
                    <Box mt={2}>
                      <Typography className={classes.helpertext}> {integration.helpertext} </Typography>
                      <Typography className={classes.caption}> {integration.caption} </Typography>
                      <Box mt={2} mb={2}>
                        {integration.inputs ? (
                          <Grid container spacing={3}>
                            {integration.inputs.map((input: any, index: number) => (
                              <Grid item key={index} xs={12} sm={12} md={6} lg={input.size}>
                                {!input.textarea ? (
                                  <Field
                                    name={input.inputName}
                                    classes={{
                                      root: classes.input,
                                    }}
                                    component={TextFormField}
                                    label={input.label}
                                    disabled={integration.isLink}
                                  />
                                ) : (
                                  <Field
                                    multiline
                                    rows={3}
                                    classes={{
                                      root: classes.textarea,
                                    }}
                                    label={input.label}
                                    name={input.inputName}
                                    component={TextFormField}
                                    disabled={integration.isLink}
                                  />
                                )}
                              </Grid>
                            ))}
                          </Grid>
                        ) : integration.input ? (
                          <Field
                            classes={{
                              root: classes.input,
                            }}
                            component={TextFormField}
                            name={integration.inputName}
                            disabled={integration.isLink}
                          />
                        ) : (
                          <Field
                            multiline
                            rows={3}
                            classes={{
                              root: classes.textarea,
                            }}
                            placeholder={`Cole aqui o código do ${integration.name}`}
                            name={integration.inputName}
                            component={TextFormField}
                            disabled={integration.isLink}
                          />
                        )}
                      </Box>
                      {integration.helpfooter !== false ? (
                        <Grid container alignItems="center" spacing={4}>
                          <Grid item>
                            <SuportLink query={integration.name} classes={classes} />
                          </Grid>
                        </Grid>
                      ) : (
                        ''
                      )}
                    </Box>
                  ) : (
                    <div style={{ margin: '15px 0' }}>
                      <AreaNotAllowed plan={plan} />
                    </div>
                  )}
                </PaperBlock>
              </div>
            )
          }
          return (
            <div key={integration.name}>
              <PaperBlock>
                <Grid container alignItems="center">
                  <Typography className={classes.title}>{integration.name}</Typography>
                  {integration.description && (
                    <Box ml={1}>
                      <Tooltip title={integration.description}>
                        <InfoOutlined />
                      </Tooltip>
                    </Box>
                  )}
                </Grid>
                <Box mt={2}>
                  <Typography className={classes.helpertext}> {integration.helpertext} </Typography>
                  <Typography className={classes.caption}> {integration.caption} </Typography>
                  <Box mt={2} mb={2}>
                    {integration.inputs ? (
                      <Grid container spacing={3}>
                        {integration.inputs.map((input: any, index: number) => (
                          <Grid item key={index} xs={12} sm={12} md={6} lg={input.size}>
                            {!input.textarea ? (
                              <Field
                                name={input.inputName}
                                classes={{
                                  root: classes.input,
                                }}
                                component={TextFormField}
                                label={input.label}
                                disabled={integration.isLink}
                              />
                            ) : (
                              <Field
                                multiline
                                rows={3}
                                classes={{
                                  root: classes.textarea,
                                }}
                                label={input.label}
                                name={input.inputName}
                                component={TextFormField}
                                disabled={integration.isLink}
                              />
                            )}
                          </Grid>
                        ))}
                      </Grid>
                    ) : integration.input ? (
                      <Field
                        classes={{
                          root: classes.input,
                        }}
                        component={TextFormField}
                        name={integration.inputName}
                        disabled={integration.isLink}
                      />
                    ) : (
                      <Field
                        multiline
                        rows={3}
                        classes={{
                          root: classes.textarea,
                        }}
                        placeholder={`Cole aqui o código do ${integration.name}`}
                        name={integration.inputName}
                        component={TextFormField}
                        disabled={integration.isLink}
                      />
                    )}
                  </Box>
                  <Box mb={3}>
                    {integration.name === 'Farmácias APP' && settings.config_farmaciasapp_integrationStatus && (
                      <IntegrationStatus status={settings.config_farmaciasapp_integrationStatus} />
                    )}
                  </Box>

                  {integration.helpfooter !== false ? (
                    <Grid container alignItems="center" spacing={4}>
                      <Grid item>
                        <SuportLink query={integration.name} classes={classes} />
                      </Grid>
                    </Grid>
                  ) : (
                    ''
                  )}
                </Box>
              </PaperBlock>
            </div>
          )
        })}
        <div>
          <PaperBlock title="Pré-visualização da listagem de mecanismo de pesquisa">
            <Box mb={3}>
              <Typography color="primary">{values.config_meta_title}</Typography>
              <Typography className={classes.greencolor}>{values.config_meta_description}</Typography>
            </Box>
            <Divider />
            <Box mt={3}>
              <FormControl fullWidth>
                <Field
                  label="Meta-titulo"
                  classes={{
                    root: classes.textfield,
                  }}
                  inputProps={{
                    maxLength: 70,
                  }}
                  component={TextFormField}
                  name="config_meta_title"
                />
              </FormControl>
            </Box>
            <Box mt={3}>
              <Field
                label="Meta-descrição"
                multiline
                rows={3}
                classes={{
                  root: classes.descriptionfield,
                }}
                inputProps={{
                  maxLength: 150,
                }}
                component={TextFormField}
                name="config_meta_description"
              />
            </Box>
          </PaperBlock>
        </div>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(MarketingIntegrationForm)
