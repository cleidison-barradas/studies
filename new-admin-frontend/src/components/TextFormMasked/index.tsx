import { withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import InputMask from 'react-input-mask'
import styles from './styles'

interface Props {
  label: string
  value: string | number | undefined
  mask: string | RegExp[]
  className: string | undefined
  classes: Record<keyof ReturnType<typeof styles>, string>
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

class TextFormMasked extends Component<Props> {
  onlyNumbers = (value: string) => {
    const formated = value.replace(/[^0-9]/g, '')
    return formated
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = this.props

    onChange({
      ...event,
      target: {
        ...event.target,
        value: this.onlyNumbers(event.target.value),
      },
    })
  }

  render() {
    const { mask, classes, label, value, className } = this.props

    return (
      <div className={classes.inputdiv}>
        <span className={classes.labelinput}>{label}</span>
        <InputMask mask={mask} className={className} value={value} onChange={this.handleChange} />
      </div>
    )
  }
}
export default withStyles(styles)(TextFormMasked)
