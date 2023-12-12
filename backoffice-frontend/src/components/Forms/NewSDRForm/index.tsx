import React, { Component } from 'react'
import { Field } from 'formik'
import { Grid, withStyles } from '@material-ui/core'

import { PostSDRRequest } from '../../../services/api/interfaces/ApiRequest'

import PaperBlock from '../../PaperBlock'
import TextFormField from '../../TextFormField'

import styles from './styles'
import SwitchFormField from '../../SwitchFormField'

interface Props {
  classes: Record<keyof ReturnType<typeof styles>, string>
  values: PostSDRRequest
}

export class NewSDRForm extends Component<Props> {
  render() {
    return (
      <>
        <PaperBlock>
          <Grid container spacing={3}>
            <Grid item xs={7} >
              <Field name='name' label='Nome' component={TextFormField} />
            </Grid>
            <Grid item xs={7} >
              <Field name='email' label='Email' component={TextFormField} />
            </Grid>
            <Grid item xs={7}>
              <Field
                name='willReceveLeadsEmail'
                label='O SDR poderá receber os emails dos novos Leads?'
                component={SwitchFormField}
              />
            </Grid>
          </Grid>
        </PaperBlock>
      </>
    )
  }
}

export default withStyles(styles)(NewSDRForm)
