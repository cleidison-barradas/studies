import { MenuItem, Select, withStyles } from '@material-ui/core'
import classNames from 'classnames'
import React, { Component } from 'react'
import style from './style'


type Props = {
  onChange: any,
  selectValue: any,
  classes: any,
}
type State = {
  data: {
    weekDays: any[]
  }
}

class CustomSelect extends Component<Props, State> {
  constructor(props: any) {
    super(props)

    this.state = {
      data: {
        weekDays: [
          {
            id: "EVERYDAY",
            value: "EVERYDAY",
            label: "Todos os dias",
          },
          {
            id: "MONTOFRI",
            value: "MONTOFRI",
            label: "Segunda a Sexta",
          },
          {
            id: "SATSUN",
            value: "SATSUN",
            label: "Sábados e domingos",
          },
          {
            id: "MON",
            value: "MON",
            label: "Segundas-feiras",
          },
          {
            id: "TUE",
            value: "TUE",
            label: "Terças-feiras",
          },
          {
            id: "WED",
            value: "WED",
            label: "Quartas-feiras"
          },
          {
            id: "THU",
            value: "THU",
            label: "Quintas-feiras"
          },
          {
            id: "FRI",
            value: "FRI",
            label: "Sextas-feiras"
          },
          {
            id: "SAT",
            value: "SAT",
            label: "Sábados"
          },
          {
            id: "SUN",
            value: "SUN",
            label: "Domingos"
          },
          {
            id: "HOLIDAY",
            value: "HOLIDAY",
            label: "Feriados"
          },
        ]
      }
    }
  }
  render() {
    const { data: { weekDays } } = this.state
    const { classes } = this.props

    return (
      <Select
        className={classNames(classes.select)}
        value={this.props.selectValue}
        onChange={this.props.onChange}
        MenuProps={{ className: classes.selectMenu }}
      >
        {
          weekDays.map(weekday => (
            <MenuItem key={weekday.id} value={weekday.value} classes={{ selected: classes.selected }}>
              {weekday.label}
            </MenuItem>
          ))}
      </Select>
    )
  }
}

export default withStyles(style)(CustomSelect)