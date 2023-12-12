import {
  TextField,
  FormControlLabel,
  Switch,
  Grid,
  InputAdornment,
  CircularProgress,
  Link,
  Box,
  Autocomplete,
} from '@mui/material'
import { Field, FieldProps, useFormikContext } from 'formik'
import React, { useCallback, useEffect, useState } from 'react'
import useSWR from 'swr'
import TextFormField from '../../components/TextFormField'
import { normalizeStr } from '../../helpers/normalizeString'
import Address from '../../interfaces/address'
import Neighborhood from '../../interfaces/neighborhood'
import { getAddressByPostcode } from '../../services/address/address.service'
import { getDeliveryRegions } from '../../services/delivery/delivery.service'

interface AddressFormFieldsProps {
  hideSetMainAddress?: boolean
  hideNeighborhoodList?: boolean
  parent?: string
}

export const AddressFormFields: React.FC<AddressFormFieldsProps> = ({
  hideSetMainAddress,
  hideNeighborhoodList,
  parent,
}) => {
  const [isFetchingPostcode, setIsFetchingPostcode] = useState(false)
  const [availableNeighborhoods, setAvailableNeighborhoods] = useState<Neighborhood[] | undefined>()
  const { values } = useFormikContext()
  const _values = parent ? (values as any)[parent] : values
  parent = parent ? `${parent}.` : undefined

  const onChangePostcode = useCallback(
    async (postcode: string, handleSuggestionAddress: (neighborhood: any) => any) => {
      setIsFetchingPostcode(true)
      const response = await getAddressByPostcode(postcode.replaceAll('-', ''))

      if (response.ok && response.data) {
        const {
          address: { street, city, neighborhood, state, uf },
        } = response.data

        const suggestionAddress = {
          street: street || '',
          name: neighborhood || '',
          city: {
            name: city || '',
            state: {
              name: state || '',
              code: uf,
            },
          },
        }
        handleSuggestionAddress(suggestionAddress)
      }

      setIsFetchingPostcode(false)
    },
    []
  )

  const { data } = useSWR('deliveryRegions', getDeliveryRegions)

  const findLocalDeliverys = useCallback(() => {
    if ((_values as Address).neighborhood.city.name && data?.regions) {
      return data.regions.filter((region) =>
        region.deliveryFees.find((deliveryFee) =>
          normalizeStr(deliveryFee.neighborhood.city.name.toLowerCase()).includes(
            normalizeStr((_values as Address).neighborhood.city.name).toLowerCase()
          )
        )
      )
    }
  }, [data?.regions, _values])

  useEffect(() => {
    if ((_values as Address).neighborhood.city.name) {
      const deliverys = findLocalDeliverys()

      if (deliverys) {
        const neighborhoods: Neighborhood[] = []
        deliverys.forEach((value) =>
          value.deliveryFees.forEach((deliveryFee) => {
            neighborhoods.push(deliveryFee.neighborhood)
          })
        )
        setAvailableNeighborhoods(neighborhoods)
      }
    }
  }, [_values, findLocalDeliverys, setAvailableNeighborhoods])

  return (
    <Grid mb={2} container spacing={2}>
      <Grid item xs={12} md={3}>
        <Field name={`${parent || ''}postcode`} required>
          {({ form, field, meta }: FieldProps) => (
            <TextFormField
              placeholder="000000000"
              label="CEP"
              fullWidth
              variant="outlined"
              InputProps={{
                endAdornment: isFetchingPostcode && (
                  <InputAdornment position="end">
                    <CircularProgress size={20} color="primary" />
                  </InputAdornment>
                ),
              }}
              field={field}
              form={form}
              meta={meta}
              value={field.value}
              onChange={(ev) => {
                form.setFieldValue(`${parent || ''}postcode`, ev.target.value)
                if (ev.target.value.length > 7)
                  onChangePostcode(ev.target.value, (value) => {
                    form.setFieldValue(`${parent || ''}neighborhood`, value)
                    form.setFieldValue(`${parent || ''}street`, value.street)
                  })
              }}
              required
            />
          )}
        </Field>
        <Box mt={1}>
          <Link
            href="https://buscacepinter.correios.com.br/app/logradouro_bairro/index.php"
            target="_blank"
            rel="noopener noreferrer"
          >
            Não sei meu cep
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Field
          name={`${parent || ''}neighborhood.city.name`}
          label="Cidade"
          fullWidth
          variant="outlined"
          required
          disabled
          as={TextField}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <Field
          name={`${parent || ''}neighborhood.city.state.name`}
          label="Estado"
          fullWidth
          disabled
          variant="outlined"
          required
          as={TextField}
        />
      </Grid>
      <Grid item xs={12} md={8}>
        <Field
          name={`${parent || ''}street`}
          label="Rua"
          fullWidth
          variant="outlined"
          required
          component={TextFormField}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <Field
          name={`${parent || ''}number`}
          label="Número"
          fullWidth
          variant="outlined"
          component={TextFormField}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Field
          name={`${parent || ''}complement`}
          label="Complemento"
          fullWidth
          variant="outlined"
          component={TextFormField}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Field name={`${parent || ''}neighborhood.name`} required>
          {({ field, form }: FieldProps) =>
            availableNeighborhoods && availableNeighborhoods.length > 1 && !hideNeighborhoodList ? (
              <Autocomplete
                options={availableNeighborhoods}
                onChange={(_, value: any) => {
                  form.setFieldValue(`${parent || ''}neighborhood.name`, value?.name)
                }}
                clearOnEscape={false}
                clearOnBlur={false}
                inputValue={field.value}
                filterOptions={(op) => op}
                getOptionLabel={(op: any) => op.name}
                renderInput={(props) => (
                  <TextField
                    label="Bairro"
                    required
                    variant="outlined"
                    {...props}
                    onChange={(e) => {
                      form.setFieldValue(`${parent || ''}neighborhood.name`, e.target.value)
                    }}
                  />
                )}
              />
            ) : (
              <TextField label="Bairro" required fullWidth variant="outlined" {...field} />
            )
          }
        </Field>
      </Grid>

      {!hideSetMainAddress && (
        <Grid item xs={12}>
          <Field name={`${parent || ''}isMain`}>
            {({ field, form }: FieldProps) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={field.value}
                    onChange={(ev, checked) => form.setFieldValue(`${parent || ''}isMain`, checked)}
                  />
                }
                label="Definir como endereço principal"
              />
            )}
          </Field>
        </Grid>
      )}
    </Grid>
  )
}
