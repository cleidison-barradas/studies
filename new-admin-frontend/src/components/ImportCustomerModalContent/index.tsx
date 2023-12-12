import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Help } from '@material-ui/icons'
import { Typography, Button, Grid, MenuItem, Tooltip, Box, withStyles } from '@material-ui/core'

import { Field, FieldProps, FormikErrors } from 'formik'
import { ReactComponent as CloudIcon } from '../../assets/images/blueCloudUploader.svg'
import { ReactComponent as DocIcon } from '../../assets/images/blueDocIcon.svg'

import ContainerErrors from '../ContainerErrors'
import CustomDropzone from '../CustomDropzone'
import SelectFormField from '../SelectFormField'

import styles from './styles'
import Plan from '../../interfaces/plan'

import institutionalCustomerModel from '../../assets/xls/institutional_customer_model.xls'

interface IAccord {
  name: string
  value: string
  toolTip?: string
}

type State = {
  accord: IAccord[]
}

interface Props {
  plan: Plan
  errors: FormikErrors<any>
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class ImportPromotionModalContent extends Component<Props> {
  state: State = {
    accord: [
      {
        value: 'consent',
        name: 'Consentimento',
        toolTip: 'Quando uma pessoa consente com o tratamento dos seus dados de forma livre.',
      },
      {
        name: 'Legítimo interesse',
        value: 'legitimate_interest',
        toolTip:
          'Quando a empresa possui um interesse legítimo para o processamento e a utilização dos dados está dentro das expectativas da pessoa, não sendo necessário obter consentimento.',
      },
      {
        name: 'Contrato pré-existente',
        value: 'pre_existing_contract',
        toolTip:
          'Quando os dados pessoais são processados por obrigação contratual ou para validação e início de vigência de um acordo.',
      },
      {
        name: 'Não sei dizer/Não possuo Base Legal',
        value: 'donot_know',
      },
    ],
  }
  _renderContent = () => {
    const { classes } = this.props

    return (
      <React.Fragment>
        <Field name="file">
          {({ field }: FieldProps) => {
            return (
              <React.Fragment>
                {field.value && (
                  <div className={classes.divwithfile}>
                    <div className={classes.row}>
                      <DocIcon />
                      {<Typography className={classes.docname}>{field.value.name}</Typography>}
                    </div>
                    <Button variant="outlined" className={classes.docbtn}>
                      substituir arquivo
                    </Button>
                  </div>
                )}
                {!field.value && (
                  <div className={classes.divwithoutfile}>
                    <CloudIcon />
                    <Typography align="center" className={classes.dropzonecaption}>
                      Clique aqui ou solte os <br /> arquivos aqui para carregar
                    </Typography>
                  </div>
                )}
              </React.Fragment>
            )
          }}
        </Field>
      </React.Fragment>
    )
  }
  render() {
    const { classes, errors, plan } = this.props
    const { accord } = this.state
    return (
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={12} sm={12}>
            <Typography className={classes.caption}>
              Baixe um{' '}
              <a
                href={
                  plan.rule === 'institutional'
                    ? institutionalCustomerModel
                    : 'https://myp-public.s3.us-west-2.amazonaws.com/cliente.xls'
                }
                download
                className={classes.link}
              >
                modelo XLS de exemplo
              </a>{' '}
              para ver um exemplo do formato necessário.
            </Typography>
          </Grid>
          <Grid item xs={12} lg={12} sm={12}>
            <div className={classes.dropzonecontainer}>
              <React.Fragment>
                <Field name="file">
                  {({ form }: FieldProps) => (
                    <CustomDropzone
                      onChange={(file: any) => form.setFieldValue('file', file[0])}
                      multiple={false}
                      content={this._renderContent}
                      border={true}
                      accept=".xls"
                    />
                  )}
                </Field>
                <ContainerErrors name="file" errors={errors} />
              </React.Fragment>
            </div>
          </Grid>
          <Grid item xs={12} lg={12} sm={12}>
            <Field name="license" label="Selecione o tipo base legal para a comunicação (LGPD)" component={SelectFormField}>
              {accord.map((item, idx) => (
                <MenuItem key={idx} value={item.value}>
                  {item.toolTip ? (
                    <Tooltip title={item.toolTip}>
                      <Box display="flex" flexDirection="row" alignItems="center">
                        {item.name}
                        <Help className={classes.iconhelp} />
                      </Box>
                    </Tooltip>
                  ) : (
                    <Box display="flex" flexDirection="row" alignItems="center">
                      {item.name}
                    </Box>
                  )}
                </MenuItem>
              ))}
            </Field>
          </Grid>
          <Grid item xs={12} lg={12} sm={12}>
            <Typography className={classes.caption}>
              {' '}
              Para acompanhar o progresso da importação veja a seção <Link to={'/import/history'}>Importação por arquivo</Link>
            </Typography>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles)(ImportPromotionModalContent)
