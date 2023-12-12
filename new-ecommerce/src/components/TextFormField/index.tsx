import { TextField } from '@material-ui/core'
import { OutlinedTextFieldProps } from '@mui/material'
import { FieldProps, getIn } from 'formik'
import React, { Component } from 'react'

class TextFormField extends Component<OutlinedTextFieldProps & FieldProps> {
  render() {
    const { field, form, ...props } = this.props as any
    const errorText = getIn(form.errors, field.name)
    return (
      <TextField
        fullWidth
        error={!!errorText}
        helperText={errorText}
        {...field}
        {...props}
      />
    )
  }
}

export default TextFormField
