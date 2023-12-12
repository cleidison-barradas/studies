import React from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  Chip,
  Grid,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
  withStyles,
  Button,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import CheckIcon from '@material-ui/icons/Check'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import PaperBlock from '../../PaperBlock'
import SuportLink from '../../SuportLink'

import style from './style'
import { ReactComponent as GreenElipse } from '../../../assets/images/greenElipse.svg'
import LoadingContainer from '../../LoadingContainer'
import moment from 'moment'
import { IntegrationContextData } from '../../../context/IntegrationContext'
import themePalette from '../../../styles/theme/themePalette'
import { StoreContextData } from '../../../context/StoreContext'
import CustomComponent from '../../CustomComponent'
import AreaNotAllowed from '../../AreaNotAllowed'
import Plan from '../../../interfaces/plan'

type Props = {
  mode: any
  plan?: Plan
  context: IntegrationContextData
  storeContext: StoreContextData
  openSnackbar: (...args: any) => void
  classes: Record<keyof ReturnType<typeof style>, string>
}

type State = {
  loaded: boolean
  mergeableFields: string[]
}

const translateField = (field: string) => {
  const translation: Record<any | string, string> = {
    name: 'Nome do produto',
    presentation: 'Apresentação',
    laboratory: 'Fabricante',
    activePrinciple: 'Princípio ativo',
  }

  return translation[field] || field
}

class IntegrationPapers extends CustomComponent<Props, State> {
  state: State = {
    loaded: false,
    mergeableFields: [],
  }

  componentDidMount() {
    this.load()
  }

  componentDidUpdate(prevProps: Props) {
    // Store got loaded?
    if (prevProps.storeContext.store !== this.props.storeContext.store) {
      const mergeableFields = this.props.storeContext.store?.settings?.etlMergeableFields || []

      this.setState({
        mergeableFields,
      })
    }
  }

  load = async () => {
    const { context } = this.props

    await context.getIntegration()

    this.setState({
      loaded: true,
    })
  }

  private getStatusText = () => {
    const { integration } = this.props.context
    if (!integration) return ''

    switch (integration.status) {
      case 'healthy':
        return 'Normal'
      case 'warning':
        return 'Instável'
      case 'problem':
        return 'Crítico: Contacte nosso suporte'
      default:
        return 'Desconhecido'
    }
  }

  private getStatusStyles = () => {
    const { integration } = this.props.context
    const palette = themePalette.skyBlueTheme.palette
    if (!integration) {
      return {
        backgroundColor: palette.grey.primary.light,
      }
    }

    switch (integration.status) {
      case 'healthy':
        return {
          backgroundColor: palette.green.light,
          color: palette.primary.contrastText,
        }
      case 'warning':
        return {
          backgroundColor: palette.yellow.primary.light,
          color: palette.primary.main,
        }
      case 'problem':
        return {
          backgroundColor: palette.red.light,
          color: palette.primary.contrastText,
        }
      default:
        return {
          backgroundColor: palette.grey.primary.light,
          color: palette.primary.dark,
        }
    }
  }

  private async handleSaveMergeable() {
    const { openSnackbar, storeContext } = this.props
    const { mergeableFields } = this.state

    await storeContext.requestaddSettings({
      settings: {
        etlMergeableFields: mergeableFields,
      },
    })

    openSnackbar('Alteração realizada com sucesso!')
  }

  private handleContentCopy = async (content: string) => {
    const { openSnackbar } = this.props

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(content)
      openSnackbar('copiado para área de transferência')
    }
  }

  private handelAddMergeableField = (field: string) => {
    if (!field.length) return

    this.setState((state) => ({
      ...state,
      mergeableFields: [...state.mergeableFields, field],
    }))
  }

  private handelRemoveMergeableField = (field: string) => {
    this.setState((state) => ({
      ...state,
      mergeableFields: state.mergeableFields.filter((v) => v !== field),
    }))
  }

  handleGenerateToken = async () => {
    const { context, storeContext } = this.props
    const { integration } = context

    context.requestGenerateToken(storeContext.store?._id, integration?.erp?.orderSupport?.email)
    await context.getIntegration()
  }

  render() {
    const { classes, context, storeContext, plan } = this.props
    const { loaded, mergeableFields } = this.state

    if (!loaded) {
      return <LoadingContainer />
    }

    const mergeableFieldsOptions = (context.integration?.mergeableFields || []).filter(
      (field: string) => !mergeableFields.includes(field)
    )

    return (
      <>
        <Box mt={context.fetching ? 1 : 2} mb={3}>
          <Grid container alignItems="center" justify="space-between">
            <Grid item>
              <Typography className={classes.headertxt}> Integração com ERP </Typography>
            </Grid>
          </Grid>
        </Box>
        <Grid container spacing={3}>
          <Grid item lg={9} md={8} xs={12}>
            <div>
              <PaperBlock>
                <Grid container alignItems="center">
                  <Typography className={classes.title}>Detalhes</Typography>
                </Grid>

                <Box mb={3}>
                  <Grid container alignItems="center">
                    <Grid item lg={3} sm={12}>
                      <Grid container direction="column" justify="flex-start" spacing={2}>
                        <Grid item>
                          <Typography className={classes.boldcaption}>SEU ERP</Typography>
                        </Grid>
                        <Grid item>
                          <Typography className={classes.value}>
                            {' '}
                            <GreenElipse /> {context.integration?.erp?.name}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item lg={6} sm={12}>
                      <Grid container direction="column" justify="flex-start" spacing={2}>
                        <Grid item>
                          <Typography className={classes.boldcaption}>REGRA DE INTEGRAÇÃO</Typography>
                        </Grid>
                        <Grid item>
                          <Typography className={classes.value}>
                            {' '}
                            <GreenElipse /> {context.integration?.erpVersion.name}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item lg={3} sm={12}>
                      <Grid container justify="flex-start" direction="column" spacing={2}>
                        <Grid item>
                          <Typography className={classes.boldcaption}>data da última integração</Typography>
                        </Grid>
                        <Grid item>
                          <Typography className={classes.value}>
                            {' '}
                            <GreenElipse />{' '}
                            {moment(context.integration?.lastSeen).calendar({
                              sameElse: 'DD/MM/YYYY HH:mm',
                            })}{' '}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </PaperBlock>
            </div>
            {context.integration?.erp && (
              <Box>
                <PaperBlock>
                  <Grid container alignItems="center">
                    <Typography className={classes.title}>Integração de Pedidos</Typography>
                    <Box ml={1}>
                      <Tooltip title="Este recurso permite que os pedidos feitos no seu e-commerce e outros canais integrados MyPharma deem a baixa automática de estoque no seu ERP. Envie as credenciais abaixo abrindo um chamado de suporte junto ao seu sistema ERP.">
                        <InfoOutlinedIcon />
                      </Tooltip>
                    </Box>
                  </Grid>
                  {this.canSeeComponent(['enterprise', 'pro', 'start', 'pro-generic'], plan) ? (
                    <Box mt={3}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                          {context.integration?.erp?.orderSupport ? (
                            <Box mb={2}>
                              <Chip
                                className={classes.chipStatus}
                                label="Integração de pedidos suportada"
                                color="primary"
                                icon={<CheckIcon />}
                              />

                              <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                  <TextField
                                    fullWidth
                                    label="Api chave"
                                    margin="dense"
                                    variant="outlined"
                                    className={classes.textfield}
                                    value={context.integration?.erp?.orderSupport?.token}
                                    InputProps={{
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          <IconButton
                                            aria-label="copy token"
                                            onClick={() =>
                                              this.handleContentCopy(context.integration?.erp?.orderSupport?.token || '')
                                            }
                                          >
                                            <FileCopyIcon />
                                          </IconButton>
                                        </InputAdornment>
                                      ),
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                  <Box mt={3}>
                                    <Button
                                      className={classes.generateButton}
                                      disabled={!!context.integration?.erp?.orderSupport?.token}
                                      onClick={async () => await this.handleGenerateToken()}
                                      variant="contained"
                                      color="primary"
                                    >
                                      Gerar api chave
                                    </Button>
                                  </Box>
                                </Grid>
                              </Grid>
                            </Box>
                          ) : (
                            <Box mt={1} mb={3}>
                              <Chip
                                className={classes.chipStatus}
                                label="Integração de pedidos não suportada"
                                color="default"
                                icon={
                                  <Tooltip title="Infelizmente não temos integração de pedidos com seu ERP. Recomendamos entrar em contato e solicitar suporte.">
                                    <InfoOutlinedIcon />
                                  </Tooltip>
                                }
                              />

                              <Accordion>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                  <Typography className={classes.heading}>Sugestão de e-mail para enviar ao seu ERP</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                  <Typography paragraph>
                                    Olá, como vai? Somos clientes do sistema ERP de vocês. Nosso CNPJ é o 00.000.000/0000-00.
                                    Estamos utilizando uma plataforma de loja virtual/e-commerce em nossa farmácia, que é a
                                    mypharma.com.br. A MyPharma é a maior plataforma de loja virtual do Brasil para farmácias e já
                                    possui integração/parceria com mais de 80 ERPs farmacêuticos, e indicam diariamente estes ERPs
                                    para farmácias que queiram uma integração completa no e-commerce! A MyPharma possui uma
                                    documentação de API para integração de pedidos entre o nosso e-commerce e ERP, de forma em que
                                    um pedido feito por um cliente em nosso e-commerce já possa ser lançado automaticamente (dados
                                    do cliente, baixa de estoque, produtos, etc) para o ERP. Isso tornaria para nossa farmácia a
                                    operação muito mais automatizada e certamente agregaria valor ao sistema ERP de vocês, tendo
                                    em vista que várias farmácias estão aderindo à MyPharma todos os dias. Segue a documentação
                                    API de integração com ERP: https://erp.orders.mypharma.com.br/docs/. Segue o contato da
                                    MyPharma para caso queiram sanar dúvidas sobre a documentação e parceria: 45 98402-2528 ou
                                    suporte@mypharma.net.br Conseguem me dar um parecer? Muito obrigado desde já.
                                  </Typography>
                                </AccordionDetails>
                              </Accordion>
                            </Box>
                          )}

                          <Grid container spacing={2}>
                            <Grid item>
                              <SuportLink query="Integração com ERP de pedidos" classes={classes} />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Box>
                  ) : (
                    <div style={{ margin: '15px 0' }}>
                      <AreaNotAllowed plan={plan} />
                    </div>
                  )}
                </PaperBlock>
              </Box>
            )}

            <Box>
              <PaperBlock>
                <Grid container alignItems="center">
                  <Typography className={classes.title}>Mesclar Campos</Typography>

                  <Box ml={1}>
                    <Tooltip title="Este recurso permite mesclar dados do produto do seu sistema ERP diretamente no produto do site.">
                      <InfoOutlinedIcon />
                    </Tooltip>
                  </Box>
                </Grid>

                {!!storeContext.store ? (
                  <>
                    <Box mt={3}>
                      <Box mb={1}>
                        <Typography color="primary">Campos Disponiveis </Typography>
                      </Box>
                      <Grid container alignItems="center" spacing={2}>
                        <Grid item lg={4} md={4} xl={3} sm={12} xs={12}>
                          <Autocomplete
                            options={mergeableFieldsOptions}
                            getOptionLabel={(op) => translateField(op)}
                            renderInput={(params) => <TextField {...params} />}
                            onChange={(ev, value: string | null) => this.handelAddMergeableField(value || '')}
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    <Box mt={3}>
                      {mergeableFields.length > 0 && (
                        <Box mb={1}>
                          <Typography color="primary">Campos atuais </Typography>
                        </Box>
                      )}

                      <Grid container spacing={2}>
                        {mergeableFields.map((value) => (
                          <Grid key={`erp_mergeable_field_${value}`} item>
                            <Chip
                              label={translateField(value)}
                              onDelete={async () => await this.handelRemoveMergeableField(value)}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Box>

                    <Box mt={3}>
                      <Button variant="contained" color="primary" onClick={() => this.handleSaveMergeable()}>
                        Salvar
                      </Button>
                    </Box>

                    <Grid className={classes.supportLinkSpacing} container spacing={2}>
                      <Grid item>
                        <SuportLink query="Integração com ERP mesclagem de campos" classes={classes} />
                      </Grid>
                    </Grid>
                  </>
                ) : (
                  <LoadingContainer />
                )}
              </PaperBlock>
            </Box>
          </Grid>
          <Grid item lg={3} md={4} xs={12}>
            <Box>
              <PaperBlock>
                <Grid container alignItems="center">
                  <Typography className={classes.title}>Status da Integração</Typography>
                </Grid>

                <Chip
                  label={this.getStatusText()}
                  classes={{
                    root: classes.status,
                  }}
                  style={this.getStatusStyles()}
                />
              </PaperBlock>
            </Box>
          </Grid>
        </Grid>
      </>
    )
  }
}

export default withStyles(style)(IntegrationPapers)
