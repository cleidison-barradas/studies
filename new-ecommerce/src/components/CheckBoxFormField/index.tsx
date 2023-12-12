import React, { Component } from "react"
import { Checkbox, FormControl, FormControlLabel } from "@mui/material"
import { FieldProps } from "formik"
import style from './style'

interface Props extends FieldProps {
  label?: string
  disabled?: boolean
  labelPlacement?: 'end' | 'bottom' | 'top' | 'start'
  classes: Record<keyof ReturnType<typeof style>, string>
}

class CheckBoxFormField extends Component<Props> {

  render() {
    const { field, form, label, disabled, labelPlacement = 'end' } = this.props

    return (
      <FormControl>
        <FormControlLabel
          label={label}
          disabled={disabled}
          labelPlacement={labelPlacement}
          control={
            <Checkbox
              color='default'
              checked={field.checked}
              onChange={(_, checked) => form.setFieldValue(field.name, checked)}
            />
          }
        />
      </FormControl>
    )
  }
}

export default CheckBoxFormField
