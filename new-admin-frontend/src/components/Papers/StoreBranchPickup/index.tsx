import { Box, Button, Grid, Tooltip, Typography, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import PaperBlock from '../../PaperBlock'

import SuportLink from '../../SuportLink'
import { StoreBranchPickup } from '../../../interfaces/storeBranchPickup'
import StoreBranchPickupForm from '../../Forms/StoreBranchPickupForm'
import { Help } from '@material-ui/icons'
import styles from './styles'
import StoreBranchPickupItem from '../../StoreBranchPickupItem'

interface Props {
  classes: any
  mainStore: boolean
  onSuccess: boolean
  available: boolean
  items: StoreBranchPickup[]
  onDelete: (data: any) => Promise<void>
  onEdit: (data: any) => Promise<void>
  loadStoreBranches: () => Promise<void>
  openSnackbar: (message: string, severity?: 'error' | 'info' | 'success' | 'warning') => void
  openDialog: (data: any) => void
  closeDialog: () => void
}

interface State {
  creatingNewStoreBranch: boolean
}

class StoreBranchPickupPaper extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      creatingNewStoreBranch: false,
    }
  }

  static defaultProps = {
    mainStore: false,
    onSuccess: false,
    available: false,
    items: [],
  }

  onDelete = async (branchPickup: StoreBranchPickup) => {
    const { loadStoreBranches, openDialog, closeDialog, onDelete } = this.props
    openDialog({
      title: `Confirme para excluir a filial`,
      description: `Deseja mesmo excluir a filial ${branchPickup.name.toUpperCase()} ?`,
      onAccept: async () => {
        await onDelete(branchPickup._id)
        await loadStoreBranches()
        closeDialog()
      },
      onDecline: () => closeDialog(),
    })
  }

  handleRegister = (data: any) => {
    const { onSuccess, openSnackbar, onEdit } = this.props
    onEdit(data)

    if (onSuccess) {
      openSnackbar('Filiais salvas !')
      setTimeout(() => {
        this.onLoad()
      }, 1500)
    } else {
      openSnackbar('Ocorreu um erro tente novamente !')
    }
  }

  setCreatingNewStoreBranch = (state: boolean) => {
    this.setState({ creatingNewStoreBranch: state })
  }

  onLoad = () => {
    const { loadStoreBranches } = this.props
    loadStoreBranches()
  }

  componentDidMount() {
    this.onLoad()
  }

  render() {
    const { classes, items } = this.props
    const { creatingNewStoreBranch } = this.state

    return (
      <div>
        <PaperBlock title="Filiais para retirada">
          <React.Fragment>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={12} sm={12}>
                <div className={classes.divtexthelp}>
                  <Typography className={classes.title}>Cadastre as filiais em que o cliente pode retirar o pedido</Typography>
                  <Tooltip
                    title="Se você possui mais de uma unidade de loja, escolha quais filiais o cliente do seu e-commerce pode escolher quando
                opta pela opção de 'retirar na loja'."
                  >
                    <Help className={classes.iconhelp} />
                  </Tooltip>
                </div>
              </Grid>
              <Grid item xs={12} md={12} sm={12} style={{ margin: 20 }}>
                <Grid container spacing={3} md={12} alignItems="center">
                  {items &&
                    items.map((item: StoreBranchPickup) => (
                      <StoreBranchPickupItem key={item._id} data={item} onDelete={this.onDelete} />
                    ))}
                </Grid>
              </Grid>
              <Grid item xs={12} md={12} sm={12} style={{ padding: 0 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={12}>
                    <Button
                      color="default"
                      variant="contained"
                      classes={{ root: classes.buttonsave }}
                      onClick={() => this.setCreatingNewStoreBranch(true)}
                    >
                      Adicionar
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Box mt={2}>
              <SuportLink query="retirar em filiais" />
            </Box>
            <StoreBranchPickupForm
              handleSubmit={this.handleRegister}
              open={creatingNewStoreBranch}
              setOpen={this.setCreatingNewStoreBranch}
            />
          </React.Fragment>
        </PaperBlock>
      </div>
    )
  }
}

export default withStyles(styles)(StoreBranchPickupPaper)
