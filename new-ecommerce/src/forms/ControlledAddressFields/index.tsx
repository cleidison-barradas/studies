import { Autocomplete, FormControlLabel, Grid, Switch, TextField } from '@mui/material'
import { Field, FieldProps } from 'formik'
import React from 'react'
import TextFormField from '../../components/TextFormField'
import { normalizeStr } from '../../helpers/normalizeString'
import { useDelivery } from '../../hooks/useDelivery'

export const ControlledAddressFields: React.FC = () => {
  const { citys, neighborhoods } = useDelivery()

  return (
    <Grid mb={2} container spacing={2}>
      <Grid item xs={12} md={6}>
        <Field name="neighborhood.city">
          {({ form, field }: FieldProps) => (
            <Autocomplete
              options={citys.map((value) => value.deliveryFees[0].neighborhood.city)}
              fullWidth
              onChange={(ev, city) => {
                form.setFieldValue('neighborhood', {
                  city,
                  name: '',
                })
              }}
              onInputChange={(e, city) => {
                const found = citys
                  .map((value) => value.deliveryFees[0].neighborhood.city)
                  .find(
                    (value) =>
                      normalizeStr(value.name).toLowerCase() === normalizeStr(city).toLowerCase()
                  )
                if (found) form.setFieldValue('neighborhood', { city: found, name: '' })
              }}
              value={field.value}
              clearOnEscape={false}
              clearOnBlur={false}
              getOptionLabel={(op: any) => op.name || ''}
              renderInput={(props) => (
                <TextField label="Cidade" required variant="outlined" {...props} />
              )}
            />
          )}
        </Field>
      </Grid>

      <Grid item xs={12} md={6}>
        <Field name="neighborhood">
          {({ form, field }: FieldProps) => (
            <Autocomplete
              options={neighborhoods
                .filter(
                  (value) => value.neighborhood.city.name === form.values.neighborhood.city?.name
                )
                .map((value) => value.neighborhood)}
              fullWidth
              value={field.value}
              onChange={(ev, value: any) => {
                form.setFieldValue(
                  'neighborhood',
                  value || { city: form.values.neighborhood.city, name: '' }
                )
              }}
              onInputChange={(e, neighborhood) => {
                const found = neighborhoods
                  .filter(
                    (value) => value.neighborhood.city.name === form.values.neighborhood.city?.name
                  )
                  .map((value) => value.neighborhood)
                  .find(
                    (value) =>
                      normalizeStr(value.name).toLowerCase() ===
                      normalizeStr(neighborhood).toLowerCase()
                  )
                if (found) form.setFieldValue('neighborhood', found)
              }}
              disabled={!form.values.neighborhood.city?._id}
              clearOnEscape={false}
              clearOnBlur={false}
              getOptionLabel={(op) => op.name}
              renderInput={(props) => (
                <TextField label="Bairro" required variant="outlined" {...props} />
              )}
            />
          )}
        </Field>
      </Grid>

      <Grid item xs={12} md={4}>
        <Field
          name="street"
          label="Rua"
          fullWidth
          variant="outlined"
          required
          component={TextFormField}
        />
      </Grid>

      <Grid item xs={12} md={2}>
        <Field
          name="number"
          label="Número"
          fullWidth
          variant="outlined"
          component={TextFormField}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <Field
          name="complement"
          label="Complemento"
          fullWidth
          variant="outlined"
          component={TextFormField}
        />
      </Grid>

      <Grid item xs={12}>
        <Field name="isMain">
          {({ field, form }: FieldProps) => (
            <FormControlLabel
              control={
                <Switch
                  checked={field.value}
                  onChange={(ev, checked) => form.setFieldValue('isMain', checked)}
                />
              }
              label="Definir como endereço principal"
            />
          )}
        </Field>
      </Grid>
    </Grid>
  )
}
