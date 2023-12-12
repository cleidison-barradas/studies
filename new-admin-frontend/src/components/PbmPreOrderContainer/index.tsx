import React, { Component } from "react"
import { Box, Chip, Typography, withStyles } from "@material-ui/core"
import styles from './styles'
import { IPbmPreOrder } from "../../interfaces/pbm"

import PbmPreOrderItemsTable from '../Tables/PbmPreOrderItemsTable'
import themePalette from "../../styles/theme/themePalette"
import moment from "moment"


interface Props {
  preOrder: IPbmPreOrder
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class PbmPreOrderContainer extends Component<Props> {

  private getStatusText = () => {
    const { preOrder } = this.props

    if (!preOrder) return ''

    switch (preOrder.status) {

      case 'COMPLETED':
        return 'Finalizado'

      case 'PENDING':
        return 'Pendente'

      case 'ERROR':
        return 'Pré venda não finalizada'

      case 'CANCEL':
        return 'Pré venda cancelada'

      default:
        return 'Desconhecido'
    }
  }

  private getStatusStyles = () => {
    const { preOrder } = this.props
    const palette = themePalette.skyBlueTheme.palette

    if (!preOrder) {

      return {
        backgroundColor: palette.grey.primary.light,
      }
    }

    switch (preOrder.status) {

      case 'COMPLETED':

        return {
          backgroundColor: palette.green.light,
          color: palette.primary.contrastText,
        }

      case 'PENDING':

        return {
          backgroundColor: palette.yellow.primary.light,
          color: palette.primary.main,
        }

      case 'ERROR':

        return {
          backgroundColor: palette.red.light,
          color: palette.primary.contrastText,
        }
      case "CANCEL":

        return {
          backgroundColor: palette.red.light,
          color: palette.primary.contrastText,
        }

      default:
        return {
          backgroundColor: palette.grey.primary.light,
          color: palette.primary.dark,
        }
    }
  }

  render() {
    const { preOrder, classes } = this.props

    return (
      <Box mt={1}>
        <Box display="flex" alignItems='center'>
          <Chip
            label={this.getStatusText()}
            classes={{
              root: classes.status,
            }}
            style={this.getStatusStyles()}
          />
        </Box>
        {preOrder.comments && (
          <Box mt={1}>
            <Typography style={{ fontSize: 14 }}>{preOrder.comments}</Typography>
          </Box>
        )}
        <Box mt={1}>
          {preOrder.status !== 'CANCEL' && preOrder.status !== 'COMPLETED' && (
            <Typography style={{ fontSize: 14 }}>Enviar dados da nota até {moment(preOrder.expirationDate).format('DD/MM/YYYY')}</Typography>
          )}
        </Box>
        <Box>
          <PbmPreOrderItemsTable items={preOrder.items} />
        </Box>
      </Box>
    )
  }
}

export default withStyles(styles)(PbmPreOrderContainer)
