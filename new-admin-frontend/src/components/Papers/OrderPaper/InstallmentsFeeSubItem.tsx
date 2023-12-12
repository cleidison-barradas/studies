import React, { Component } from 'react'
import { Box, Grid, Typography } from '@material-ui/core'

import { floatToBRL } from '../../../helpers/moneyFormat'

interface Props {
  installmentsFeeValue: number
}

class InstallmentsFeeSubItem extends Component<Props> {
  render() {
    const { installmentsFeeValue } = this.props
    return (

      <Box mb={2}>
        <Grid container justify='space-between'>
          <Grid item>
            <Typography
              style={{
                fontSize: 14,
                fontWeight: 'bold',
              }}>
              Taxa de Parcelamento (Stone / Pagar.me)
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              style={{ fontSize: 14 }}
            >
              {floatToBRL(installmentsFeeValue)}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    )
  }
}

export default InstallmentsFeeSubItem
