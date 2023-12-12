import { Typography, Button, Grid } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import React, { Component } from 'react'
import { ReactComponent as CloudIcon } from '../../assets/images/blueCloudUploader.svg'
import { ReactComponent as DocIcon } from '../../assets/images/blueDocIcon.svg'
import CustomDropzone from '../CustomDropzone'
import CustomDatePicker from '../CustomDatePicker'
import { Field, FieldProps, FormikErrors } from 'formik'
import styles from './styles'
import moment from 'moment'
import { PutImportPromotion } from '../../services/api/interfaces/ApiRequest'
import ContainerErrors from '../ContainerErrors'
import { Link } from 'react-router-dom'

interface Props {
  errors: FormikErrors<PutImportPromotion>
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class ImportPromotionModalContent extends Component<Props> {
  _renderContent = () => {
    const { classes } = this.props

    return (
      <React.Fragment>
        <Field name="file">
          {({ form, field }: FieldProps) => {
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
    const { classes } = this.props
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} lg={12} sm={12}>
          <Typography className={classes.caption}>
            Baixe um{' '}
            <a href="https://myp-public.s3-us-west-2.amazonaws.com/utils/importador-promocao.xls" download className={classes.link}>
              modelo XLS de exemplo
            </a>{' '}
            para ver um exemplo do formato necessário.
          </Typography>
        </Grid>
        <Grid item xs={12} lg={12} sm={12}>
          <div className={classes.dropzonecontainer}>
            <Field name="file">
              {({ field, form }: FieldProps) => (
                <React.Fragment>
                  <CustomDropzone
                    onChange={(file: any) => form.setFieldValue('file', file[0])}
                    multiple={false}
                    content={this._renderContent}
                    border={true}
                    accept=".xls"
                  />
                  <ContainerErrors name="file" errors={form.errors} />
                </React.Fragment>
              )}
            </Field>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} lg={6}>
          <Field name="date_start">
            {({ field, form }: FieldProps) => (
              <React.Fragment>
                <CustomDatePicker
                  label="Início da promoção"
                  setDate={(date: Date) => form.setFieldValue('date_start', moment(date).utc(true).toISOString())}
                  date={field.value}
                />
                <ContainerErrors name="date_start" errors={form.errors} />
              </React.Fragment>
            )}
          </Field>
        </Grid>
        <Grid item xs={12} sm={6} lg={6}>
          <Field name="date_end">
            {({ field, form }: FieldProps) => (
              <React.Fragment>
                <CustomDatePicker
                  label="Fim da promoção"
                  setDate={(date: Date) => form.setFieldValue('date_end', moment(date).utc(true).toISOString())}
                  date={field.value}
                />
                <ContainerErrors name="date_end" errors={form.errors} />
              </React.Fragment>
            )}
          </Field>
        </Grid>
        <Grid item xs={12} lg={12} sm={12}>
          <Typography className={classes.caption}>
            {' '}
            Para acompanhar o progresso da importação veja a seção <Link to={'/import/history'}>Importação por arquivo</Link>
          </Typography>
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(styles)(ImportPromotionModalContent)
