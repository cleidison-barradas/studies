import { Box, Grid, Link, Typography, withStyles } from '@material-ui/core'
import { ArrowUpward } from '@material-ui/icons'
import { Field, FieldProps } from 'formik'
import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import toBase64 from '../../../helpers/to-base-64'
import TextFormField from '../../TextFormField'
import styles from './styles'

interface Props {
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class PixForm extends Component<Props> {
  parse = async (value: any) => {
    const content = await toBase64(value)
    const { name, type } = value
    return {
      content,
      name,
      type,
    }
  }

  render() {
    const { classes } = this.props
    return (
      <React.Fragment>
        <Grid container spacing={2} alignItems="center">
          <Grid item lg={3} xl={1} md={2}>
            <Typography className={classes.title}>Pix</Typography>
          </Grid>
        </Grid>
        <Box mt={2}>
          <Grid container spacing={3}>
            <Grid item lg={6} md={6} sm={12} xs={12} xl={4}>
              <Field
                component={TextFormField}
                label="Client ID"
                className={classes.textfield}
                variant="outlined"
                fullWidth
                name="paymentMethod.extras[0]"
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12} xl={4}>
              <Field
                component={TextFormField}
                name="paymentMethod.extras[1]"
                label="Client Secret"
                className={classes.textfield}
                variant="outlined"
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item lg={6} md={6} sm={12} xs={12} xl={4}>
              <Field
                component={TextFormField}
                name="paymentMethod.extras[2]"
                label="Chave Pix"
                className={classes.textfield}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12} xl={4}>
              <Field name="certificate">
                {({ form, field }: FieldProps) => {
                  return (
                    <Dropzone
                      accept=".p12"
                      multiple={false}
                      onDrop={async (acceptedFiles) => form.setFieldValue('certificate', acceptedFiles[0])}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div {...getRootProps()} className={classes.fileContainer}>
                          <label htmlFor="logo"> Certificado </label>
                          <input
                            type="file"
                            className={classes.fileInput}
                            id="logo"
                            onChange={async (e) => {
                              if (e.target.files) {
                                form.setFieldValue('certificate', e.target.files[0])
                              }
                            }}
                            {...getInputProps()}
                          />
                          {field.value || form.values.paymentMethod.extras[3] ? (
                            <Typography color="inherit">
                              {field.value?.name || form.values.paymentMethod.extras[3].split('/')[2]}
                            </Typography>
                          ) : (
                            <React.Fragment>
                              <Typography color="inherit">Adicione o certificado</Typography>
                              <ArrowUpward color="inherit" />
                            </React.Fragment>
                          )}
                        </div>
                      )}
                    </Dropzone>
                  )
                }}
              </Field>
            </Grid>
          </Grid>
          <Box mt={2}>
            <Link
              href={`https://mypharmasupport.zendesk.com/hc/pt-br/search?utf8=%E2%9C%93&query=${'integrar com pix'.replaceAll(
                ' ',
                '+'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Saber mais sobre como integrar o Pix (GerenciaNet)
            </Link>
          </Box>
        </Box>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(PixForm)
