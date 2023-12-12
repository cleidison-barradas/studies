import { Box, Chip, Grid, MenuItem, TextField, withStyles } from '@material-ui/core'
import { Autocomplete, AutocompleteRenderInputParams } from '@material-ui/lab'
import { Field, FieldArray, FieldArrayRenderProps, FieldProps } from 'formik'
import React, { Component } from 'react'
import CustomDatePicker from '../../CustomDatePicker'
import SelectFormField from '../../SelectFormField'
import styles from './styles'

interface Props {
  classes: Record<keyof ReturnType<typeof styles>, string>
}

type StatusFilter = {
  label: string
  value: string
  tooltipText?: string
}

type State = {
  selectedStatusFilter: StatusFilter[]
}


class ExportOrderForm extends Component<Props, State> {

  state: State = {
    selectedStatusFilter: []
  }

  statusfiltersList: StatusFilter[] = [
    {
      label: 'Pendente',
      value: 'pending',
    },
    {
      label: 'Aceito',
      value: 'accepted',
    },
    {
      label: 'Rejeitado',
      value: 'rejected',
    },
    {
      label: 'Entrega Realizada',
      value: 'delivery_made',
    },
    {
      label: 'Estornado',
      value: 'reversed',
    },
    {
      label: 'Saiu para Entrega',
      value: 'out_delivery',
    },
    {
      label: 'Pagamento Realizado',
      value: 'payment_made',
    },
    {
      label: 'Aguardando / Em separação',
      value: 'default',
      tooltipText:
        'Pedidos com status de aguardando algo, em separação ou demais pedidos.',
    },
  ]

  render() {
    const { selectedStatusFilter } = this.state
    return (
      <Box mt={2}>
        <Box mt={2}>
          <Grid container spacing={2}>
            <Grid item xl={4} lg={4} md={4} sm={4} xs={12}>
              <Field name="startAt">
                {({ field, form }: FieldProps) => (
                  <React.Fragment>
                    <CustomDatePicker label="De" date={field.value} setDate={(date: Date) => form.setFieldValue('startAt', date)} />
                  </React.Fragment>
                )}
              </Field>
            </Grid>
            <Grid item xl={4} lg={4} md={4} sm={4} xs={12}>
              <Field name="endAt">
                {({ field, form }: FieldProps) => (
                  <React.Fragment>
                    <CustomDatePicker label="Até" date={field.value} setDate={(date: Date) => form.setFieldValue('endAt', date)} />
                  </React.Fragment>
                )}
              </Field>
            </Grid>
          </Grid>
        </Box>
        <Box mt={2}>
          <Grid container spacing={2}>
            <Grid item xl={4} lg={4} md={4} sm={4} xs={12}>
              <Field
                name="prefix"
                label="Origem do pedido"
                component={SelectFormField}
                style={{ height: 58}}
              >
                <MenuItem value="mypharma">E-commerce</MenuItem>
                <MenuItem value="iFood">IFood</MenuItem>
              </Field>
            </Grid>
            <Grid item xl={4} lg={4} md={4} sm={4} xs={12}>

              <FieldArray
                name="orderStatus"
                render={({ form, push }: FieldArrayRenderProps) => (
                  <Autocomplete
                    options={this.statusfiltersList}
                    renderInput={(params: AutocompleteRenderInputParams) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Status do Pedido"
                        placeholder="Filtre por Status"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                      />
                    )}
                     getOptionDisabled={(option: StatusFilter) =>
                       form.values.orderStatus.find((status: StatusFilter) => status.value === option.value)
                         ? true
                         : false
                     }
                    getOptionLabel={(op: StatusFilter) => op.label}
                    onChange={(ev: any, status: StatusFilter | null) => {
                      if (status) {
                        push(status)
                      }
                    }}
                  />
                )}
              />
              <Box>
                <Grid container spacing={2}>
                  <FieldArray
                    name="orderStatus"
                    render={({ form, remove }: FieldArrayRenderProps) => (
                      <Grid container>
                        {form.values.orderStatus.map((status: StatusFilter, index: number) => (
                          <Box ml={index !== 0 ? 1 : 0} mt={1} key={index}>
                            <Chip label={status.label} onDelete={() => remove(index)} />
                          </Box>
                        ))}
                      </Grid>
                    )}
                  />

                  {selectedStatusFilter.map((data) => (
                    <Chip key={data.value} label={data.label}
                      onDelete={() => {
                        selectedStatusFilter.splice(selectedStatusFilter.findIndex(item => item.value === data.value), 1)
                        this.setState({ selectedStatusFilter })
                      }}
                    />
                  ))}
                </Grid>
              </Box>
            </Grid>

          </Grid>
        </Box>
      </Box>
    )
  }
}

export default withStyles(styles)(ExportOrderForm)
