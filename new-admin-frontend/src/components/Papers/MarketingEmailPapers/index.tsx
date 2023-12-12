import { Box, Button, Chip, Grid, Typography, withStyles } from '@material-ui/core'
import LaunchIcon from '@material-ui/icons/Launch'
import { Field, FieldProps, Form, Formik } from 'formik'
import { decode } from 'html-entities'
import { isEqual } from 'lodash'
import * as yup from 'yup'
import { ReactComponent as ArrowLeft } from '../../../assets/images/goBack.svg'
import { ReactComponent as EmailIlustration } from '../../../assets/images/ilustration/email.svg'
import { FileConsumer, FileProvider } from '../../../context/FileContext'
import MarketingAutomations from '../../../interfaces/marketingAutomations'
import Plan from '../../../interfaces/plan'
import { IMarketingAutomationRequest } from '../../../services/api/interfaces/ApiRequest'
import ContainerErrors from '../../ContainerErrors'
import CustomComponent from '../../CustomComponent'
import HtmlEditorEmail from '../../HtmlEditorEmail'
import PaperBlock from '../../PaperBlock'
import TextFormField from '../../TextFormField'
import style from './style'

type Props = {
  mode: any
  classes: any
  history: any
  plan: Plan
  loadAutomations: () => void
  automations: MarketingAutomations
  copyClipBoard: (text: string) => void
  onSave: (data: IMarketingAutomationRequest) => void
}

class MarketingEmailPapers extends CustomComponent<Props> {
  onLoad = () => {
    const { loadAutomations } = this.props

    loadAutomations()
  }

  componentDidMount() {
    this.onLoad()
  }

  handleClipBoard = async (text: string) => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text)
    }
  }

  schemaValidate = yup.object({
    automations: yup.object({
      _id: yup.string(),
      status: yup.boolean(),
      message: yup.string().required('o corpo da mensagem é obrigatório').nullable(),
      target: yup.string(),
      subject: yup.string().required('o título da mensagem é obrigatório').nullable(),
      MISS_YOU_15: yup.boolean(),
      MISS_YOU_20: yup.boolean(),
      MISS_YOU_30: yup.boolean(),
      RECENT_CART: yup.boolean(),
    }),
  })

  render() {
    const { classes, automations, history, plan, copyClipBoard, onSave } = this.props
    return (
      <Formik
        initialValues={{
          automations: { ...automations, subject: automations.subject || '' },
        }}
        validationSchema={this.schemaValidate}
        onSubmit={onSave}
        enableReinitialize
      >
        {({ initialValues, values, errors }) => (
          <Form>
            <Box mb={3}>
              <Grid container justify="space-between" alignItems="center">
                <Grid item>
                  <Grid container spacing={2}>
                    {this.canSeeComponent(['pro', 'pro-generic', 'start', 'enterprise'], plan) && (
                      <Grid item>
                        <Button
                          variant="contained"
                          classes={{
                            root: classes.gobackbtn,
                          }}
                          onClick={() => history.goBack()}
                        >
                          <ArrowLeft />
                        </Button>
                      </Grid>
                    )}
                    <Grid item>
                      <Typography className={classes.headertxt}>Disparo de E-mail em Massa</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container spacing={2}>
                    <Grid item>
                      <Button>Cancelar</Button>
                    </Grid>
                    <Grid item>
                      <Button disabled={isEqual(initialValues, values)} type="submit" variant="contained" color="primary">
                        Enviar
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
            <Grid container spacing={3}>
              <Grid item lg={8} md={8} sm={12} xs={12}>
                <PaperBlock title="Envie um e-mail para todos os seus clientes">
                  <Field
                    name="automations.subject"
                    className={classes.textfield}
                    label="Escreva o título do seu e-mail"
                    autoComplete="off"
                    component={TextFormField}
                  />
                  <Box mt={2} mb={1}>
                    <Grid container justify="space-between" alignItems="center">
                      <Grid item>
                        <Typography className={classes.caption}>Corpo do seu e-mail</Typography>
                      </Grid>
                    </Grid>
                  </Box>

                  <FileProvider>
                    <FileConsumer>
                      {({ requestAddImage, image }) => (
                        <Field name="automations.message">
                          {({ field, form }: FieldProps) => (
                            <HtmlEditorEmail
                              message={decode(field.value, { level: 'all' })}
                              onChange={(content: string) => form.setFieldValue('automations.message', content)}
                              image={image}
                              uploadImage={requestAddImage}
                            />
                          )}
                        </Field>
                      )}
                    </FileConsumer>
                  </FileProvider>

                  <ContainerErrors name="message" errors={errors} />
                </PaperBlock>
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <Box>
                  <PaperBlock>
                    <Grid container spacing={4} wrap={'nowrap'}>
                      <Grid item>
                        <EmailIlustration />
                      </Grid>
                      <Grid item>
                        <Grid container direction="column" justify="space-between" style={{ height: '100%' }}>
                          <Typography className={classes.title}>Como criar um disparo de e-mail em massa?</Typography>
                          <Typography className={classes.description}>
                            Conheça as dicas que temos para melhorar os e-mails que seus clientes recebem.
                          </Typography>
                          <a
                            className={classes.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://mypharmasupport.zendesk.com/hc/pt-br/search?utf8=%E2%9C%93&query=disparos+de+email"
                          >
                            {' '}
                            Veja o tutorial <LaunchIcon />{' '}
                          </a>
                        </Grid>
                      </Grid>
                    </Grid>
                  </PaperBlock>
                </Box>
                <Box mt={1}>
                  <PaperBlock title="Explicação do código">
                    <Typography className={classes.description}>
                      O conteúdo deste email utiliza variáveis de código. É importante conhecê-las para entender as informações
                      que você vai mostrar.
                    </Typography>
                    <Box mt={2}>
                      <Grid container spacing={2}>
                        <Grid item sm={12} md={12} lg={12} xs={12}>
                          <Box display="flex" alignItems="center">
                            <Chip
                              label="{{ customer_name }}"
                              onClick={() => copyClipBoard('{{ customer_name }}')}
                              classes={{
                                root: classes.chip,
                              }}
                            />
                            <Typography className={classes.caption}>Nome do cliente</Typography>
                          </Box>
                        </Grid>
                        <Grid item sm={12} md={12} lg={12} xs={12}>
                          <Box display="flex" alignItems="center">
                            <Chip
                              label="{{ store_url }}"
                              onClick={() => copyClipBoard('{{ store_url }}')}
                              classes={{
                                root: classes.chip,
                              }}
                            />
                            <Typography className={classes.caption}>Site da Loja</Typography>
                          </Box>
                        </Grid>
                        <Grid item sm={12} md={12} lg={12} xs={12}>
                          <Box display="flex" alignItems="center">
                            <Chip
                              label="{{ store_name }}"
                              onClick={() => copyClipBoard('{{ store_name }}')}
                              classes={{
                                root: classes.chip,
                              }}
                            />
                            <Typography className={classes.caption}>Nome da sua loja.</Typography>
                          </Box>
                        </Grid>
                        <Grid item sm={12} md={12} lg={12} xs={12}>
                          <Box display="flex" alignItems="center">
                            <Chip
                              label="{{ store_phone }}"
                              onClick={() => copyClipBoard('{{ store_phone }}')}
                              classes={{
                                root: classes.chip,
                              }}
                            />
                            <Typography className={classes.caption}>Telefone da Loja</Typography>
                          </Box>
                        </Grid>
                        <Grid item sm={12} md={12} lg={12} xs={12}>
                          <Box display="flex" alignItems="center">
                            <Chip
                              label="{{ store_whatsapp }}"
                              onClick={() => copyClipBoard('{{ store_whatsapp }}')}
                              classes={{
                                root: classes.chip,
                              }}
                            />
                            <Typography className={classes.caption}>Whatsapp da Loja</Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </PaperBlock>
                </Box>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    )
  }
}

export default withStyles(style)(MarketingEmailPapers)
