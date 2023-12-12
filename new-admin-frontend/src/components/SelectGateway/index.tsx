import React, { Component } from 'react'
import { FormControl, Grid, MenuItem, Select, withStyles } from '@material-ui/core'
import styles from './styles'

interface Props {
  classes: Record<keyof ReturnType<typeof styles>, string>
  onChangeGateway: (arg0: string) => void
  value: any
}

class SelectGateway extends Component<Props> {
  render() {
    const { classes, onChangeGateway, value } = this.props
    return (
      <Grid container md={4} className={classes.content}>
        <FormControl fullWidth>
          <Select
            className={classes.selectField}
            value={value}
            onChange={(e) => onChangeGateway(e.target.value as any)}
            variant='outlined'
          >
            <MenuItem value='none'>Selecione</MenuItem>
            <MenuItem value='stone'>Stone (Pagar.me)</MenuItem>
            <MenuItem value='pagseguro'>PagSeguro</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    )
  }
}

export default withStyles(styles)(SelectGateway)
