import React, { Component } from 'react'
import { Grid, Typography, withStyles } from '@material-ui/core'
// Interfaces
import Plan from '../../interfaces/plan'
// Styles
import styles from './styles'

interface Props {
  plan?: Plan
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class AreaNotAllowed extends Component<Props> {
  _renderTitle = () => {
    const { plan } = this.props
    if (plan) {
      switch (plan.rule) {
        case 'pro':
          return 'Funcionalidade disponível apenas no plano Enterprise. Para upgrade, chame nosso suporte.'
        case 'start':
          return 'Funcionalidade disponível apenas nos planos PRO/Enterprise. Para upgrade, chame nosso suporte.'
        default:
          return 'Funcionalidade indisponível'
      }
    }
    return 'Funcionalidade indisponível, chame nosso suporte.'
  }

  render() {
    const { classes } = this.props
    return (
      <div className={classes.containercontent}>
        <Grid container justify="center" alignItems="center" direction="column">
          <Grid item xs={12} sm={12} lg={12} md={12}>
            <Typography>{this._renderTitle()}</Typography>
          </Grid>
          <Grid item xs={12} sm={12} lg={12} md={12} style={{ margin: '20px 0' }}>
            <img className={classes.image} src={require('../../assets/images/cadeado.png').default} alt="" />
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles)(AreaNotAllowed)