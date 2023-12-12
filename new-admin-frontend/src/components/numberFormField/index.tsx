import { TextField, withStyles } from '@material-ui/core'
import { FieldProps, getIn } from 'formik'
import React, { Component } from 'react'
import { createStyles, Theme } from '@material-ui/core'

interface Props extends FieldProps {
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class NumberFormField extends Component<Props> {
  render() {
    const { field, form, classes, ...props } = this.props
    const errorText = getIn(form.touched, field.name) && getIn(form.errors, field.name)
    return (
      <TextField
        fullWidth
        variant="outlined"
        error={!!errorText}
        className={classes.focused}
        {...field}
        {...props}
      />
    )
  }
}

const styles = (theme: Theme) =>
  createStyles({
    root: {},
    focused: {
      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#5CB9FF',
        borderWidth: '1px',
      },
    },
  })

export default withStyles(styles)(NumberFormField)
