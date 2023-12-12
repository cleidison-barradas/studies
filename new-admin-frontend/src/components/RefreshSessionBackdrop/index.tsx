import { Backdrop, Grid, Typography } from '@material-ui/core'
import React, { Component } from 'react'
import { AuthConsumer } from '../../context/AuthContext'


class RefreshSessionBackdrop extends Component {
  render() {
    return (
      <AuthConsumer>
        {({ refreshingSession }) => (
          <Backdrop open={refreshingSession} invisible in exit>
            <Grid container direction="column" spacing={4} justify="center" alignItems="center">
              <Grid item>
                <Typography color="textPrimary" style={{ fontSize: 32 }}>
                  Sessão detectada, conferindo credenciais.
                </Typography>
              </Grid>
              <Grid item>
                <Typography color="textSecondary" style={{ fontSize: 16 }}>
                  Aguarde alguns segundos enquanto checamos, ao terminar voce será redirecionado para o painel ou a pagina de
                  login
                </Typography>
              </Grid>
            </Grid>
          </Backdrop>
        )}
      </AuthConsumer>
    )
  }
}

export default RefreshSessionBackdrop
