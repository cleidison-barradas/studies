import React, { Component } from 'react'
import { Checkbox, Chip, FormControlLabel, Grid, TextField, withStyles } from '@material-ui/core'
import { Autocomplete, AutocompleteRenderInputParams, createFilterOptions } from '@material-ui/lab'
import { Field, FieldArray, FieldArrayRenderProps, FieldProps, FormikErrors } from 'formik'

// interfaces
import City from '../../../interfaces/city'
import State from '../../../interfaces/state'
import { Neighborhood } from '../../../interfaces/neighborhood'
// Custom inputs
import TextFormField from '../../TextFormField'
import CurrencyTextField from '../../CurrencyTextField'

import styles from './styles'
import DeliveryFee from '../../../interfaces/deliveryFee'
import ContainerErrors from '../../ContainerErrors'

interface NeighborhoodOptions extends Neighborhood {
  value?: any
  name: string
}

interface Props {
  cities: City[]
  states: State[]
  errors: FormikErrors<DeliveryFee | undefined>
  fetching: boolean
  neighborhoods: Neighborhood[]
  onAddNeighborhood: (data: any, cityId: string) => void
  getCities: (id: City['_id'] | null) => void
  getNeighborhods: (id: Neighborhood['_id'] | null) => void
  classes: Record<keyof ReturnType<typeof styles>, string>
  deliveries: DeliveryFee[]
}

class AddStoreDeliveries extends Component<Props> {
  static defaultProps = {
    states: [],
    cities: [],
    errors: {},
    fetching: false,
    neighborhoods: [],
  }
  filterOptions = createFilterOptions<NeighborhoodOptions>()

  filterRegisteredNeighborhoods = (options: Neighborhood[], selectedNeighborhoods: Neighborhood[]): Neighborhood[] => {
    const { deliveries } = this.props

    return options.filter((option) =>
      selectedNeighborhoods.find((neighborhood: Neighborhood) => neighborhood._id === option._id) ||
        deliveries.find((delivery) => delivery.neighborhood._id === option._id)
        ? false
        : true
    )
  }

  render() {
    const { classes, states, cities, neighborhoods, fetching, errors, getCities, getNeighborhods, onAddNeighborhood } = this.props

    return (
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} lg={4}>
            <Field name="state">
              {({ field, form }: FieldProps) => (
                <Autocomplete
                  options={states}
                  value={field.value}
                  defaultValue={field.value}
                  getOptionLabel={(option) => option.name}
                  getOptionDisabled={() => false}
                  onChange={(event: React.ChangeEvent<{}>, state: State | null) => {
                    if (state) {
                      getCities(state._id)
                      form.setFieldValue('state', state)
                    } else {
                      form.setFieldValue('state', null)
                    }
                  }}
                  renderInput={(params: AutocompleteRenderInputParams) => (
                    <TextField {...params} variant="outlined" label="Estados" role="list-box" />
                  )}
                  ListboxProps={{ role: 'list-box' }}
                />
              )}
            </Field>
            <ContainerErrors errors={errors} name="state" />
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <Field name="city">
              {({ field, form }: FieldProps) => (
                <Autocomplete
                  options={cities}
                  value={field.value}
                  defaultValue={field.value}
                  getOptionLabel={(option) => option.name}
                  getOptionDisabled={() => false}
                  onChange={(event: React.ChangeEvent<{}>, city: City | null) => {
                    if (city) {
                      getNeighborhods(city._id)
                      form.setFieldValue('city', city)
                    } else {
                      form.setFieldValue('city', null)
                    }
                  }}
                  renderInput={(params: AutocompleteRenderInputParams) => (
                    <TextField {...params} variant="outlined" label="Cidade" />
                  )}
                />
              )}
            </Field>
            <ContainerErrors errors={errors} name="city" />
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <FieldArray
              name="neighborhoods"
              render={({ form }: FieldArrayRenderProps) => (
                form.values.neighborhoods ?
                <React.Fragment>
                  <Autocomplete
                    multiple
                    clearOnBlur
                    limitTags={3}
                    selectOnFocus
                    loading={fetching}
                    options={this.filterRegisteredNeighborhoods(neighborhoods, form.values.neighborhoods)}
                    value={form.values.neighborhoods}
                    getOptionLabel={(option) => option.name}
                    onChange={(event: React.ChangeEvent<{}>, neighborhood: Neighborhood[]) => {
                      if (neighborhood) {
                        const neighborhoodToAdd = neighborhood.find((x) => !x._id)
                        if (neighborhoodToAdd) {
                          onAddNeighborhood(neighborhoodToAdd, form.values.city._id)
                        } else {
                          form.setFieldValue('neighborhoods', neighborhood)
                        }
                      }
                    }}
                    renderTags={(tagValue, getTagProps) =>
                      tagValue.map((option, index) => <Chip key={index} label={option.name} {...getTagProps({ index })} />)
                    }
                    renderInput={(params: AutocompleteRenderInputParams) => (
                      <TextField {...params} variant="outlined" label="Bairros" />
                    )}
                    filterOptions={(options: Neighborhood[], state: any) => {
                      const filtred = this.filterOptions(options, state)

                      if (state.inputValue !== '') {
                        filtred.push({
                          value: state.inputValue.toUpperCase(),
                          name: `Adicionar : '${state.inputValue}'`.toUpperCase(),
                          city: form.values.city,
                        })
                      }
                      return filtred
                    }}
                  />
                  <ContainerErrors errors={errors} name="neighborhoods" />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="checked"
                        checked={form.values.neighborhoods.length === neighborhoods.length && neighborhoods.length > 0}
                        onChange={() => {
                          if (form.values.neighborhoods.length === neighborhoods.length) {
                            form.setFieldValue('neighborhoods', [])
                          } else {
                            if (form.values.neighborhoods) {
                              form.setFieldValue('neighborhoods', neighborhoods)
                            }
                          }
                        }}
                      />
                    }
                    label="Adicionar todos os bairros"
                    labelPlacement="start"
                    style={{ display: 'flex' }}
                  />
                </React.Fragment>
                :
                <div />
              )}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ marginTop: 60 }}>
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <Field name="feePrice">
              {({ field, form }: FieldProps) => (
                <CurrencyTextField
                  prefix="R$ "
                  label="Taxa de Entrega"
                  value={field.value}
                  thousandSeparator="."
                  decimalSeparator=","
                  className={classes.inputs}
                  onChange={({ floatValue }) => {
                    form.setFieldValue('feePrice', floatValue)
                  }}
                />
              )}
            </Field>
            <ContainerErrors errors={errors} name="feePrice" />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <Field name="freeFrom">
              {({ field, form }: FieldProps) => (
                <CurrencyTextField
                  prefix="R$ "
                  label="Grátis a partir"
                  value={field.value}
                  thousandSeparator="."
                  decimalSeparator=","
                  className={classes.inputs}
                  onChange={({ floatValue }) => {
                    form.setFieldValue('freeFrom', floatValue)
                  }}
                />
              )}
            </Field>
            <ContainerErrors errors={errors} name="feePrice" />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <Field name="minimumPurchase">
              {({ field, form }: FieldProps) => (
                <CurrencyTextField
                  prefix="R$ "
                  label="Minímo para entrega"
                  value={field.value}
                  thousandSeparator="."
                  decimalSeparator=","
                  className={classes.inputs}
                  onChange={({ floatValue }) => {
                    form.setFieldValue('minimumPurchase', floatValue)
                  }}
                />
              )}
            </Field>
            <ContainerErrors errors={errors} name="minimumPurchase" />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <Field type="number" autoComplete="off" name="deliveryTime" label="Tempo de entrega" component={TextFormField} />
            <ContainerErrors errors={errors} name="deliveryTime" />
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles)(AddStoreDeliveries)
