import { Box, Button, Divider, Grid, Typography, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import { ReactComponent as ArrowLeft } from '../../assets/images/goBack.svg'
import MarketingPushPapers from '../../components/Papers/MarketingPushPapers'
import style from './style'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import LaunchIcon from '@material-ui/icons/Launch'
import customerxService from '../../services/customerx.service'

type Props = {
  classes: any
  mode: any
  history: any
}

type State = {
  selected: string
}

class MarketingEmail extends Component<Props, State> {
  constructor(props: any) {
    super(props)

    this.state = {
      selected: 'text',
    }

    this.setSelected = this.setSelected.bind(this)
  }

  componentDidMount() {
    customerxService.trackingScreen()
  }

  setSelected(value: string) {
    this.setState({
      ...this.state,
      selected: value,
    })
  }

  render() {
    const { classes, mode, history } = this.props
    const { selected } = this.state
    return (
      <>
        <Box mb={3}>
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <Grid container spacing={2}>
                <Grid item>
                  <Button
                    variant="contained"
                    classes={{
                      root: classes.gobackbtn,
                    }}
                    onClick={() => history.goBack()}
                  >
                    <ArrowLeft />
                  </Button>
                </Grid>
                <Grid item>
                  <Typography className={classes.headertxt}>Envie uma Notificação para todos os seus clientes</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container spacing={2}>
                <Grid item>
                  <Button>Cancelar</Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="primary">
                    Salvar
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
        <MarketingPushPapers mode={mode} setSelected={this.setSelected} selected={selected} />
        <Box mt={3}>
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <Grid container spacing={2}>
                <Grid item>
                  <Button>Cancelar</Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="primary">
                    Salvar
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container spacing={2}>
                <Grid item>
                  <a href=" " className={classes.link}>
                    Tem mais dúvidas <HelpOutlineIcon />{' '}
                  </a>
                </Grid>
                <Divider
                  flexItem
                  orientation="vertical"
                  classes={{
                    root: classes.divider,
                  }}
                />
                <Grid item>
                  <a href=" " className={classes.caption}>
                    Mais informações sobre personalização do conteúdo das notificações automáticas pré-configuradas <LaunchIcon />{' '}
                  </a>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </>
    )
  }
}

export default withStyles(style)(MarketingEmail)
