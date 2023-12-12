import DateFnsUtils from '@date-io/date-fns'
import { withStyles } from '@material-ui/core'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import React, { Component } from 'react'
import ptBR from 'date-fns/locale/pt-BR'
import style from './style'

type Props = {
  name?: any,
  classes: any,
  setDate?: any,
  label?: string,
  className?: any
  date?: Date | null,
  disablePast?: boolean
}

class CustomDatePicker extends Component<Props> {
  render() {
    const { date, setDate, label, className, name, disablePast } = this.props
    return (
      <MuiPickersUtilsProvider  locale={ptBR} utils={DateFnsUtils}>
        <KeyboardDatePicker
          name={name}
          value={date}
          label={label}
          fullWidth
          disableToolbar
          onChange={setDate}
          format="dd/MM/yyyy"
          className={className}
          inputVariant="outlined"
          placeholder="--/--/----"
          disablePast={disablePast}
        />
      </MuiPickersUtilsProvider>
    )
  }
}

export default withStyles(style)(CustomDatePicker)
