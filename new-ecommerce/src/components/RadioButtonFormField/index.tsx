import { FormControlLabel, Radio } from "@mui/material"
import { Component } from "react"

interface Props {
  value?: string
  label?: string
  labelPlacement?: 'end' | 'bottom' | 'top' | 'start'
}

class RadioButtonFormField extends Component<Props> {

  render() {
    const { label, value, labelPlacement } = this.props

    return (
      <FormControlLabel
        value={value}
        label={label}
        labelPlacement={labelPlacement}
        control={<Radio />}
      />
    )
  }
}

export default RadioButtonFormField
