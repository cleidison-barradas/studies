import { Grid, withStyles } from '@material-ui/core'
import { Field } from 'formik'
import React, { Component } from 'react'
import TextFormField from '../../TextFormField'
import styles from './styles'

interface Props {
    classes: Record<keyof ReturnType<typeof styles>, string>
}

class PlanForm extends Component<Props> {
    render() {
        return (
            <Grid container direction="column" spacing={3}>
                <Grid item>
                    <Field name="name" label="Nome" component={TextFormField} />
                </Grid>
                <Grid item>
                    <Field name="description" label="Descrição" component={TextFormField} />
                </Grid>
                <Grid item>
                    <Field name="price" label="Preço" type="number" component={TextFormField} />
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles)(PlanForm)
