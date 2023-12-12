import React, { Component } from 'react'
import { Typography, Grid, Slider, Input, withStyles } from '@material-ui/core'
import style from './styles'


type Props = {
  classes: any
}

class CustomRagePrice extends Component<Props> {

  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <Typography id="input-slider" gutterBottom>
          Faixa de preço
      </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Input
              className={classes.input}
              value={0}
              margin="dense"
              inputProps={{
                step: 10,
                min: 0,
                max: 100,
                type: 'number',
                'aria-labelledby': 'range-slider',
              }}
            />
          </Grid>
          <Grid item xs>
            <Slider
              value={0}
              aria-labelledby="range-slider"
            />
          </Grid>
          <Grid item>
            <Input
              className={classes.input}
              value={0}
              margin="dense"
              inputProps={{
                step: 10,
                min: 0,
                max: 100,
                type: 'number',
                'aria-labelledby': 'range-slider',
              }}
            />
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(style)(CustomRagePrice)