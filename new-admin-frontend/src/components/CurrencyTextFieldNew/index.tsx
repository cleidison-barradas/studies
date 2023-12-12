import { withStyles } from '@material-ui/styles'
import React, { Component } from 'react'
// @ts-ignore
import CurrencyInput from 'react-currency-input-field'
import styles from './styles'

interface Props {
  label?: string
  prefix?: string
  suffix?: string
  precision?: string
  className: string
  disabled?: boolean
  decimalSeparator?: string
  thousandSeparator?: string
  value: string | undefined
  classes: Record<keyof ReturnType<typeof styles>, string>
  onChange: (value: string | undefined) => void
  placeholder?: string
}
class CurrencyTextFieldNew extends Component<Props> {
  render() {
    const { value, label, classes, className, prefix, decimalSeparator, thousandSeparator, placeholder } = this.props
    return (
      <div
        className={classes.divcontaier}
        style={{
          borderColor: value ? 'black' : 'grey',
        }}
      >
        <span className={classes.currencylabel}>{label}</span>
        <CurrencyInput
          className={className}
          decimalsLimit={2}
          onValueChange={this.props.onChange}
          value={value}
          placeholder={placeholder}
          prefix={prefix}
          decimalSeparator={decimalSeparator}
          groupSeparator={thousandSeparator}
          intlConfig={{
            locale: 'pt-BR',
            currency: 'BRL',
          }}
        />
      </div>
    )
  }
}
export default withStyles(styles)(CurrencyTextFieldNew)
