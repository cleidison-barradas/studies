import { Grid, TextField, withStyles } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import { Field, FieldArray } from 'formik'
import { debounce } from 'lodash'
import React, { Component } from 'react'
import { ErpConsumer } from '../../../context/ErpContext'
import TextFormField from '../../TextFormField'
import styles from './styles'

interface Props {
    classes: Record<keyof ReturnType<typeof styles>, string>
}

class ErpForm extends Component<Props> {
    render() {
        return (
            <React.Fragment>
                <ErpConsumer>
                    {({ versions, getErpVersions }) => (
                        <Grid container spacing={2}>
                            <Grid item lg={4} md={4} xl={4} sm={12} xs={12}>
                                <Field name="name" label="Nome" component={TextFormField} />
                            </Grid>
                            <Grid item lg={12} md={12} xl={12} sm={12} xs={12}>
                                <FieldArray
                                    name="versions"
                                    render={({ form }) => (
                                        <React.Fragment>
                                            <Autocomplete
                                                options={versions}
                                                multiple
                                                value={form.values.versions}
                                                getOptionLabel={(version) => version.name}
                                                onChange={(ev: any, version) =>
                                                    version && form.setFieldValue('versions', version)
                                                }
                                                onInputChange={debounce(async (e, name) => {
                                                    await getErpVersions({ name })
                                                }, 500)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Procure e versões"
                                                        variant="outlined"
                                                    />
                                                )}
                                            />
                                        </React.Fragment>
                                    )}
                                />
                            </Grid>
                        </Grid>
                    )}
                </ErpConsumer>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(ErpForm)
