import { FormControl, MenuItem, Select, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import styles from './styles'
import classNames from 'classnames'

interface Props {
  onChange: (date: string) => void
  value: string
  classes: Record<keyof ReturnType<typeof styles>, string>
  color?: 'light' | 'dark'
}

class DaysFilter extends Component<Props> {
  render() {
    const { onChange, value, classes, color = 'light' } = this.props
    return (
      <FormControl fullWidth className={classNames(classes.root, classes[color])}>
        <Select value={value} onChange={(e) => onChange(e.target.value as any)}>
          <MenuItem value="7daysAgo">7 dias atrás</MenuItem>
          <MenuItem value="15daysAgo">15 dias atrás</MenuItem>
          <MenuItem value="30daysAgo">30 dias atrás</MenuItem>
        </Select>
      </FormControl>
    )
  }
}

export default withStyles(styles)(DaysFilter)
