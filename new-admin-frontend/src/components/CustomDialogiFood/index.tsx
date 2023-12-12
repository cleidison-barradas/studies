import React, { Component } from 'react'
import { Button, withStyles, Typography, Box } from '@material-ui/core'
import style from './style'

type Props = {
  classes: any
  closeModal: () => void
  onSave: () => void
}

class CustomDialogiFood extends Component<Props> {
  render() {
    const { classes, closeModal, onSave } = this.props

    return (
      <Box className={classes.flex}>
        <Typography>Tem certeza que deseja finalizar o pedido?</Typography>
        <Box className={classes.flexbuttons}>
          <Button variant="contained" className={classes.buttoncancel} onClick={() => closeModal()}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" className={classes.buttonconfirm} onClick={() => onSave()}>
            Confirmar
          </Button>
        </Box>
      </Box>
    )
  }
}

export default withStyles(style)(CustomDialogiFood)
