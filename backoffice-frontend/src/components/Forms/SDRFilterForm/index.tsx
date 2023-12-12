import React, { Component } from 'react'
import { Button, CircularProgress, Grid, withStyles, MenuItem, Box } from '@material-ui/core'
import { Field, FormikState } from 'formik'

import TextFormField from '../../TextFormField'
import SelectFormField from '../../SelectFormField'

import SDR from '../../../interfaces/SDR'
import { GetSDRsRequest } from '../../../services/api/interfaces/ApiRequest'

import styles from './styles'

interface Props {
  isSubmitting: boolean
  equal: boolean
  sdrs: SDR[]
  getSDRs: (data: GetSDRsRequest) => void
  classes: Record<keyof ReturnType<typeof styles>, string>
  resetForm: (nextState?: Partial<FormikState<GetSDRsRequest>> | undefined) => void
}

export class SDRFilterForm extends Component<Props> {
  static defaultProps = {
    fetching: false,
    sdrs: [],
    pagination: {
      page: 0,
      pages: 1,
      total: 0,
      limit: 10,
      currentPage: 0,
      prevPage: null,
      nextPage: null,
    },
  }

  componentDidMount() {
    this.onLoad({})
  }

  onLoad = (data: GetSDRsRequest) => {
    const { getSDRs } = this.props

    getSDRs(data)
  }

  render() {
    const { isSubmitting, equal, classes, resetForm } = this.props

    return (
      <>
        <Grid container spacing={2}>
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <Field
              name='search'
              label='Nome ou email do SDR'
              component={TextFormField}
              className={classes.input}
            />
          </Grid>
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <Field
              name='status'
              label='SDRs que poderão receber email'
              component={SelectFormField}
            >
              <MenuItem key={'true'} value={'true'}>Sim</MenuItem>
              <MenuItem key={'false'} value={'false'}>Não</MenuItem>
            </Field>
          </Grid>
          <Grid item lg={2} md={12} sm={12} xs={12}>
            <Box display={'flex'}>
              <Button
                type='submit'
                variant='contained'
                color='primary'
                disabled={isSubmitting || equal}
                className={classes.searchbutton}
              >
                {isSubmitting ? <CircularProgress size={22} color='secondary' /> : 'Procurar'}
              </Button>

              <Button
                className={classes.searchbutton}
                color='default'
                onClick={() => {
                  this.onLoad({})
                  resetForm()
                }}
                variant='contained'
              >
                Resetar
              </Button>
            </Box>
          </Grid>
        </Grid >
      </>
    )
  }
}

export default withStyles(styles)(SDRFilterForm)
