import { FormControl, FormHelperText, InputLabel, MenuItem, Select, withStyles } from '@material-ui/core'
import { FieldProps, getIn } from 'formik'
import React, { Component } from 'react'
import styles from './styles'

interface Props extends FieldProps {
    classes: Record<keyof ReturnType<typeof styles>, string>
    label?: string
    options?: any[]
    labelField?: string
    valueField?: string
}

class SelectFormField extends Component<Props> {
    render() {
        const { label, options = [], valueField = '_id', labelField = 'name', form, field, children, ...props } = this.props
        const errorText = getIn(form.touched, field.name) && getIn(form.errors, field.name)
        return (
            <FormControl fullWidth error={!!errorText} variant="outlined" {...props}>
                {label && <InputLabel> {label} </InputLabel>}
                <Select fullWidth label={label} variant="outlined" {...field} {...props}>
                    {!children
                        ? options.map((op: any) => (
                              <MenuItem
                                  value={op[valueField]}
                                  disabled={field.value[valueField] === op[valueField]}
                                  key={op[valueField]}
                              >
                                  {op[labelField]}
                              </MenuItem>
                          ))
                        : children}
                </Select>
                <FormHelperText> {errorText} </FormHelperText>
            </FormControl>
        )
    }
}

export default withStyles(styles)(SelectFormField)
