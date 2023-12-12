import React, { Component } from "react"
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material"
import { FieldProps, getIn } from "formik"
import style from './style'

interface Props extends FieldProps {
  label?: string
  options?: any[]
  labelField?: string
  valueField?: string
  classes: Record<keyof ReturnType<typeof style>, string>
}

class SelectFormField extends Component<Props> {

  render() {
    const { label, options = [], valueField = 'id', labelField = 'name', form, field, children, ...props } = this.props
    const errorText = getIn(form.touched, field.name) && getIn(form.errors, field.name)

    return (
      <FormControl
        fullWidth
        error={!!errorText}
        variant="outlined"
        {...props}
      >
        {label && <InputLabel>{label}</InputLabel>}
        <Select
          fullWidth
          label={label}
          variant="outlined"
          {...field}
          {...props}
        >
          {!children ? (
            options.map(option => (
              <MenuItem
                key={option[valueField]}
                value={option[valueField]}
                disabled={field.value[valueField] === option[valueField]}
              >
                {option[labelField]}
              </MenuItem>
            ))
          ) : children}
        </Select>
        <FormHelperText>{errorText}</FormHelperText>
      </FormControl>
    )
  }
}

export default SelectFormField
