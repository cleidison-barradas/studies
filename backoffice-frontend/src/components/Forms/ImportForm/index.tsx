import { Button, Grid, Typography, withStyles } from '@material-ui/core'
import { Field, FieldProps } from 'formik'
import React, { Component } from 'react'
import CustomDropzone from '../../CustomDropzone'
import TextFormField from '../../TextFormField'
import { ReactComponent as CloudIcon } from '../../../assets/images/blueCloudUploader.svg'
import { ReactComponent as DocIcon } from '../../../assets/images/blueDocIcon.svg'
import styles from './styles'
import SwitchFormField from '../../SwitchFormField'

interface Props {
    classes: any
}

class ImportForm extends Component<Props> {
    _renderContent = () => {
        const { classes } = this.props

        return (
            <React.Fragment>
                <Field name="file">
                    {({ field }: FieldProps) => (
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
                    )}
                </Field>
            </React.Fragment>
        )
    }

    render() {
        const { classes } = this.props
        return (
            <Grid container spacing={3}>
                <Grid item xs={12} lg={12} sm={12} md={12}>
                    <Typography className={classes.caption}>
                        Baixe um{' '}
                        <a
                            download
                            href="https://myp-public.s3.us-west-2.amazonaws.com/modelo_importacao_pmcs/xls_conformidade_site_20211010_093851553.zip"
                        >
                            modelo XLS de exemplo
                        </a>{' '}
                        para ver um exemplo do formato necessário.
                    </Typography>
                </Grid>
                <Grid item xs={12} lg={12} sm={12} md={12}>
                    <Field name="file">
                        {({ form }: FieldProps) => (
                            <CustomDropzone
                                content={this._renderContent}
                                onChange={(file: any) => form.setFieldValue('file', file.pop())}
                            />
                        )}
                    </Field>
                </Grid>
                <Grid item xs={12} lg={12} sm={12} md={12}>
                    <Field name="updateAll" component={SwitchFormField} label="Atualizar pmc em todas as farmácias ?" />
                </Grid>
                <Grid item xs={12} lg={12} sm={12} md={12}>
                    <Field name="updateAll">
                        {({ field }: FieldProps) =>
                            !field.value && <Field name="store" component={TextFormField} label="para atualizar uma ou mais farmácias insira a URL(s) separadas por vírgula" />
                        }
                    </Field>
                </Grid>
            </Grid>
        )
    }
}
export default withStyles(styles)(ImportForm)
