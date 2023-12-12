import { withStyles } from '@material-ui/styles'
import React, { Component } from 'react'
// @ts-ignore
import CurrencyInput from 'react-currency-input'

import styles from './styles'

interface IonChange {
  event: React.ChangeEvent<HTMLInputElement>
  maskedvalue: any
  floatValue: number
}
interface Props {
  label?: string
  prefix?: string
  suffix?: string
  precision?: string
  className: string
  disabled?: boolean
  decimalSeparator?: string
  thousandSeparator?: string
  value: number | undefined
  classes: Record<keyof ReturnType<typeof styles>, string>
  onChange: ({ event, maskedvalue, floatValue }: IonChange) => void
}
class CurrencyTextField extends Component<Props> {
  handleChange = (event: React.ChangeEvent<HTMLInputElement>, maskedvalue: any, floatValue: number) => {
    const { onChange } = this.props
    onChange({
      event,
      maskedvalue,
      floatValue,
    })
  }
  render() {
    const { value, label, classes, className, ...props } = this.props
    return (
      <div className={classes.divcontaier}>
        <span className={classes.currencylabel}>{label}</span>
        <CurrencyInput {...props} value={value} className={className} onChangeEvent={this.handleChange} />
      </div>
    )
  }
}
export default withStyles(styles)(CurrencyTextField)
