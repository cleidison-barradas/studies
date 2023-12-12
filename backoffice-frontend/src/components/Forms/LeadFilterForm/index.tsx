import React, { Component } from 'react'
import { Button, CircularProgress, Grid, withStyles, Box, MenuItem } from '@material-ui/core'
import { Field, FieldProps, FormikState } from 'formik'
import { DateRange } from 'materialui-daterange-picker'
import { startOfDay, endOfDay } from 'date-fns'
import moment from 'moment'

import DatePickerDialog from '../../Dialogs/DatePickerDialog'
import TextFormField from '../../TextFormField'
import SelectFormField from '../../SelectFormField'

import Lead from '../../../interfaces/Lead'
import { GetLeadsRequest } from '../../../services/api/interfaces/ApiRequest'

import styles from './styles'

interface Props {
  isSubmitting: boolean
  equal: boolean
  leads: Lead[]
  getLeads: (data?: GetLeadsRequest) => void
  resetForm: (nextState?: Partial<FormikState<GetLeadsRequest>> | undefined) => void
  classes: Record<keyof ReturnType<typeof styles>, string>
}

interface State {
  dateModalOpen: boolean
}

export class LeadFilterForm extends Component<Props, State> {
  static defaultProps = {
    fetching: false,
    leads: [],
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

  state = {
    dateModalOpen: false,
  }

  toggleModal = () => {
    this.setState({
      ...this.state,
      dateModalOpen: !this.state.dateModalOpen,
    })
  }

  componentDidMount() {
    this.onLoad({})
  }

  onLoad = (data: GetLeadsRequest) => {
    const { getLeads } = this.props

    getLeads(data)
  }

  render() {
    const { dateModalOpen } = this.state
    const { isSubmitting, equal, classes, resetForm } = this.props

    return (
      <>
        <Grid container spacing={2}>
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <Field
              name='search'
              label='Pesquise pelo nome ou email do Lead'
              component={TextFormField}
              className={classes.input}
            />
          </Grid>
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <Field
              name='status'
              label='Status do Lead'
              component={SelectFormField}
              className={classes.input}
            >
              <MenuItem key={'open'} value={'open'}>Aberto</MenuItem>
              <MenuItem key={'pending'} value={'pending'}>Em Andamento</MenuItem>
              <MenuItem key={'closed'} value={'closed'}>Fechado</MenuItem>
            </ Field>
          </Grid>
          <Grid item lg={2} md={12} sm={12} xs={12}>
            <Field name='startDate'>
              {({ field: { value }, form }: FieldProps) => (
                <Button onClick={this.toggleModal} className='' fullWidth>
                  {value ? (
                    <>
                      {value && moment(value).format('DD-MM-YYYY')}
                      {form.values.endDate &&
                        ' - ' + moment(form.values.endDate).format('DD-MM-YYYY')}
                    </>
                  ) : (
                    'Filtrar por data'
                  )}
                </Button>
              )}
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
        <Field name='createdAt'>
          {({ form }: FieldProps) => (
            <DatePickerDialog
              open={dateModalOpen}
              toggle={this.toggleModal}
              clear={() => {
                form.setFieldValue('startDate', undefined)
                form.setFieldValue('endDate', undefined)
              }}
              onChange={(data: DateRange) => {
                if (data.startDate) form.setFieldValue('startDate', startOfDay(data.startDate))
                if (data.endDate) form.setFieldValue('endDate', endOfDay(data.endDate))
              }}
            />
          )}
        </Field>
      </>
    )
  }
}

export default withStyles(styles)(LeadFilterForm)
