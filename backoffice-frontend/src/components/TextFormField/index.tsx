import { TextField, withStyles } from '@material-ui/core'
import { FieldProps, getIn } from 'formik'
import React, { Component } from 'react'
import styles from './styles'

interface Props extends FieldProps {
    classes: Record<keyof ReturnType<typeof styles>, string>
}

class TextFormField extends Component<Props> {
  render () {
    const { field, form, ...props } = this.props
    const errorText = getIn(form.touched, field.name) && getIn(form.errors, field.name)
    return (
            <TextField fullWidth variant="outlined" error={!!errorText} helperText={errorText} {...field} {...props} />
    )
  }
}

export default withStyles(styles)(TextFormField)
