import { Grid, withStyles } from '@material-ui/core'
import { Field } from 'formik'
import React, { Component } from 'react'
import PaperBlock from '../../PaperBlock'
import TextFormField from '../../TextFormField'
import styles from './styles'

interface Props {
    classes: Record<keyof ReturnType<typeof styles>, string>
}

class IntegrationApiForm extends Component<Props> {
    render() {
        return (
            <React.Fragment>
                <PaperBlock title="Trier API">
                    <Grid container spacing={2}>
                        <Grid item lg={6} md={12} xs={12} sm={12} xl={6}>
                            <Field
                                name="token"
                                label="Token de acesso"
                                component={TextFormField}
                            />
                        </Grid>
                        <Grid item lg={6} md={12} xs={12} sm={12} xl={6}>
                            <Field
                                name="baseUrl"
                                label="Base URL"
                                component={TextFormField}
                            />
                        </Grid>
                    </Grid>
                </PaperBlock>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(IntegrationApiForm)
