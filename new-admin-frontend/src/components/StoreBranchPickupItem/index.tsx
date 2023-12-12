import { Box, Button, Grid, Typography, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import styles from './styles'
import { StoreBranchPickup } from '../../interfaces/storeBranchPickup'
import { Delete } from '@material-ui/icons'

interface Props {
  classes: any
  data?: StoreBranchPickup
  onDelete: (data: any) => void
}

class StoreBranchPickupitem extends Component<Props> {
  render() {
    const { classes, data, onDelete } = this.props
    return (
      <Grid container spacing={3} alignItems="center" className={classes.root}>
        <Grid item xs={8} sm={8} md={8}>
          <Grid item xs={12} sm={12} md={12}>
            <Typography variant="h6" classes={{ root: classes.title }}>
              {data?.name.toUpperCase()}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <Typography variant="body1" classes={{ root: classes.subtitle }}>
              {data?.address.street}, {data?.address.number || 's/n'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <Typography variant="body1" classes={{ root: classes.subtitle }}>
              {data?.address.neighborhood.name}, {data?.address.neighborhood.city.name} -{' '}
              {data?.address.neighborhood.city.state.name}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <Typography variant="body1" classes={{ root: classes.subtitle }}>
              {data?.address.complement}{' '}
            </Typography>
          </Grid>
        </Grid>
        <Grid container item xs={4} sm={4} md={4} justify="center">
          <Box className={classes.buttons}>
            <Grid item xs={12} sm={12} md={12}>
              <Button className={classes.button} onClick={() => onDelete(data)}>
                <Delete fontSize="small" color="inherit" />
                Excluir
              </Button>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(styles)(StoreBranchPickupitem)
