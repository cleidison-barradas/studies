import { Grid, Typography, Box, TextField, Button } from '@material-ui/core'
import React, { Component } from 'react'
import Showcase from '../../../interfaces/showcase'
import CustomDialog from '../../CustomDialog'

type Props = {
  classes: any
  onSave: (initialDate?: Date, finalDate?: Date) => any
  closeModal: any
  showcase: Showcase
  open: boolean
}

type State = {
  initialDate?: Date
  finalDate?: Date
}

export default class ShowcaseDates extends Component<Props, State> {
  constructor(props: any) {
    super(props)

    this.state = {}

    this.modalContent = this.modalContent.bind(this)
    this.footer = this.footer.bind(this)
    this.onChange = this.onChange.bind(this)
    this.save = this.save.bind(this)
  }

  save() {
    const { initialDate, finalDate } = this.state
    this.props.onSave(initialDate, finalDate)
    this.props.closeModal()
  }

  onChange(field: any, value: any) {
    this.setState({
      ...this.state,
      [field]: value,
    })
  }

  componentDidMount() {
    const {
      showcase: { initialDate, finalDate },
    } = this.props

    if (initialDate && finalDate) {
      this.setState({
        initialDate,
        finalDate,
      })
    }
    if (!initialDate && finalDate) {
      this.setState({
        finalDate,
      })
    }
    if (initialDate && !finalDate) {
      this.setState({
        initialDate,
      })
    }
  }

  modalContent() {
    const { finalDate, initialDate } = this.state

    return (
      <>
        <Grid container alignItems="center" justify="space-between">
          <Typography>Inicia em</Typography>
          <Box ml={1}>
            <TextField
              type="date"
              value={initialDate && initialDate}
              onChange={(e) => this.onChange('initialDate', e.target.value)}
            />
          </Box>
        </Grid>
        <Box mt={1}>
          <Grid container alignItems="center" justify="space-between">
            <Typography>Até</Typography>
            <Box ml={1}>
              <TextField
                type="date"
                value={finalDate && finalDate}
                onChange={(e) => this.onChange('finalDate', e.target.value)}
              />
            </Box>
          </Grid>
        </Box>
      </>
    )
  }

  footer() {
    return (
      <Grid container justify="flex-end">
        <Grid item>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <Button color="default" onClick={this.props.closeModal}>
                Cancelar
              </Button>
            </Grid>
            <Grid item>
              <Button color="primary" variant="contained" onClick={this.save}>
                Salvar
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }

  render() {
    const { closeModal, open } = this.props
    return (
      <CustomDialog
        open={open}
        closeModal={closeModal}
        title="Programação Personalizada da Vitrine"
        dividers={true}
        content={this.modalContent}
        footer={this.footer}
      />
    )
  }
}
