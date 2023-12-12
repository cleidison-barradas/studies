import React, { Component } from 'react'
import { Box, Grid, Typography, withStyles } from '@material-ui/core'
import PaperBlock from '../PaperBlock'

import styles from './styles'
import Tracking from '../../interfaces/tracking'
import Order from '../../interfaces/order'

interface Props {
  order: Order | null
  tracking: string | Tracking[]
  classes: Record<keyof ReturnType<typeof styles>, string>
}

const SenderText: Record<string, string> = {
  courier: 'Correios',
  bestshipping: 'Melhor envio',
  not_selected: 'Não selecionado',
}

class StatusShipping extends Component<Props> {

  render() {
    const { tracking = [], order, classes } = this.props
    const sender = order?.sender || 'not_selected'

    return (
      <PaperBlock title="Status da Encomenda">
        {tracking.length === 0 ? (
          <Typography>Será preciso aguardar 24h após a postagem para que código apresente algum resultado</Typography>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography style={{ fontWeight: 'bold' }}>Transportadora: {SenderText[sender]}</Typography>
            </Grid>
            {typeof tracking === 'string' && (
              <Grid item xs={12}>
                <a
                  target="_blank"
                  className={classes.problems}
                  href={tracking.toString()}
                  rel="noopener noreferrer"
                >
                  Clique aqui para consultar o status da encomenda
                </a>
              </Grid>

            )}
            {tracking instanceof Array && tracking.map((tr, index) => (
              <Grid key={index} item xs={12}>
                <Box display='flex'>
                  <Typography>{tr.status}{' '}{tr.data}{' '}{tr.local}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </PaperBlock>
    )
  }
}

export default withStyles(styles)(StatusShipping)
