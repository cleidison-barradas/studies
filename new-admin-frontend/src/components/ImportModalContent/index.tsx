import { Button, Typography, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import CustomDropzone from '../CustomDropzone'
import { ReactComponent as CloudIcon } from '../../assets/images/blueCloudUploader.svg'
import { ReactComponent as DocIcon } from '../../assets/images/blueDocIcon.svg'
import SwitchFormField from '../SwitchFormField'
import { Field, FieldProps } from 'formik'
import style from './style'
import ContainerErrors from '../ContainerErrors'

type Props = {
  classes: Record<keyof ReturnType<typeof style>, string>
}

type State = {
  file?: FileList | null
}

class ImportModalContent extends Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {}
  }

  content = () => {
    const { classes } = this.props

    return (
      <React.Fragment>
          <Field>
            {({ field }: FieldProps) => (
              <React.Fragment>
                {field.value && field.value.file && (
                  <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                    <div className={classes.row}>
                      <DocIcon />
                      {<Typography className={classes.docname}>{field.value.file.name}</Typography>}
                    </div>
                    <Button variant="outlined" className={classes.docbtn}>
                      substituir arquivo
                    </Button>
                  </div>
                )}
                {!field.value.file && (
                  <React.Fragment>
                    <CloudIcon />
                    <Typography align="center" className={classes.dropzonecaption}>
                      Clique aqui ou solte os <br /> arquivos aqui para carregar
                    </Typography>
                  </React.Fragment>
                )}
              </React.Fragment>
            )}
          </Field>
      </React.Fragment>
    )
  }

  render() {
    const { classes } = this.props

    return (
      <React.Fragment>
        <Typography className={classes.caption}>
          Baixe um{' '}
          <a href="https://myp-public.s3-us-west-2.amazonaws.com/utils/importador.xls" download className={classes.link}>
            modelo XLS de exemplo
          </a>{' '}
          para ver um exemplo do formato necessário.
        </Typography>
        <div className={classes.dropzonecontainer}>
          <Field name="file">
            {({ field, form }: FieldProps) => (
              <React.Fragment>
                <CustomDropzone
                  onChange={(file: any) => form.setFieldValue('file', file[0])}
                  multiple={false}
                  content={this.content}
                  border={field.value && field.value.file ? false : true}
                  accept=".xls"
                />
                <ContainerErrors errors={form.errors} name="file" />
              </React.Fragment>
            )}
          </Field>
        </div>
        <div className={classes.row2}>
          <Field label="Atualizar produtos ?" name="updateProduct" component={SwitchFormField} />
        </div>
        <div className={classes.row2}>
          <Typography className={classes.caption}>Se ativo, atualiza produtos já cadastrados</Typography>
        </div>
      </React.Fragment>
    )
  }
}

export default withStyles(style)(ImportModalContent)
