import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  withStyles
} from '@material-ui/core'
import { FieldProps, getIn } from 'formik'
import React, { Component } from 'react'
import styles from './styles'

interface Props extends FieldProps {
    classes: Record<keyof ReturnType<typeof styles>, string>
    label?: string
    labelPlacement?: 'start' | 'bottom' | 'top' | 'end' | undefined
    options?: any[]
    labelField?: string
    valueField?: string
}

class SelectFormField extends Component<Props> {
  render () {
    const {
      label,
      options = [],
      valueField = '_id',
      labelField = 'name',
      form,
      field,
      labelPlacement = 'start',
      children,
      ...props
    } = this.props
    const errorText = getIn(form.touched, field.name) && getIn(form.errors, field.name)
    return (
            <FormControl fullWidth error={!!errorText} variant="outlined" component="fieldset">
                {label && <FormLabel component="legend"> {label} </FormLabel>}
                <RadioGroup {...field} {...props}>
                    {!children
                      ? options.map((op: any) => (
                              <FormControlLabel
                                  value={op[valueField]}
                                  label={op[labelField]}
                                  control={<Radio />}
                                  labelPlacement={labelPlacement}
                                  key={op[valueField]}
                              />
                      ))
                      : children}
                </RadioGroup>
                <FormHelperText> {errorText} </FormHelperText>
            </FormControl>
    )
  }
}

export default withStyles(styles)(SelectFormField)
