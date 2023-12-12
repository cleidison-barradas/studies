import {
  Hidden,
  Grid,
  Stack,
  Typography,
  TextField,
  Select,
  MenuItem,
  Tooltip,
} from '@mui/material'
import { Field, FieldProps } from 'formik'
import React, { useState } from 'react'
import { MaskedInput } from '../../components/MaskedInput'
import { CardWrapper } from './styles'
import Card from 'react-credit-cards'
import { HelpOutline } from '@mui/icons-material'
import { Installment } from '.'
import { useInstallments } from '../../hooks/useInstallments'
import MinValueToInstallmentsCard from '../../components/MinValueToInstallmentsCard'

interface Props {
  values: any
  errors: any
}

export const CardFormFields: React.FC<Props> = ({ values, errors }) => {
  const [activeField, setActiveField] = useState<any>('')
  const { isInstallmentsAvaliable } = useInstallments()

  const handleFocus = (e: any) => {
    setActiveField(e.target.name)
  }

  return (
    <React.Fragment>
      <Grid justifyContent="center" container spacing={2}>
        <Grid item xs={12} md={12} lg={6} xl={6}>
          <Hidden mdDown>
            <CardWrapper>
              <Field name="card">
                {({ form }: FieldProps) => (
                  <Card
                    cvc={form.values.cvc}
                    expiry={form.values.expiry}
                    name={form.values.name}
                    number={form.values.number}
                    focused={activeField}
                    placeholders={{
                      name: 'Nome no cartão',
                    }}
                  />
                )}
              </Field>
            </CardWrapper>
          </Hidden>
        </Grid>
        <React.Fragment>
          <Grid item xs={12} md={12} lg={6} xl={6}>
            <Stack spacing={2}>
              <div>
                <Typography mb={1} fontSize={14}>
                  Número do cartão
                </Typography>
                <Field
                  name="number"
                  mask="9999 9999 9999 9999"
                  onFocus={handleFocus}
                  fullWidth
                  autoFocus
                  required
                  variant="outlined"
                  as={MaskedInput}
                />
              </div>
              <div>
                <Typography mb={1} fontSize={14}>
                  Nome impresso no cartão
                </Typography>
                <Field
                  name="name"
                  onFocus={handleFocus}
                  fullWidth
                  variant="outlined"
                  as={TextField}
                />
              </div>
            </Stack>
          </Grid>
          <Grid item xs={12} md={12} lg={12} xl={12}>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ width: '100%' }}>
                  <Typography mb={1} fontSize={14}>
                    Data de validade
                  </Typography>
                  <Field
                    name="expiry"
                    onFocus={handleFocus}
                    fullWidth
                    mask="99/9999"
                    variant="outlined"
                    required
                    as={MaskedInput}
                  />
                </div>
                <div style={{ width: '100%' }}>
                  <Typography display="flex" alignItems="center" gap={1} mb={1} fontSize={14}>
                    CVV
                    <Tooltip
                      placement="right-start"
                      title="Últimos 3 números no verso do seu cartão"
                    >
                      <HelpOutline />
                    </Tooltip>
                  </Typography>
                  <Field
                    name="cvc"
                    onFocus={handleFocus}
                    fullWidth
                    variant="outlined"
                    required
                    mask="999"
                    as={MaskedInput}
                  />
                </div>
              </Stack>
              <div>
                <Typography mb={1} fontSize={14}>
                  CPF ou CNPJ do portador do cartão
                </Typography>
                <Field
                  name="cpf"
                  fullWidth
                  as={MaskedInput}
                  value={values.cpf}
                  error={!!errors.cpf}
                  mask="999.999.999-99"
                  helperText={errors.cpf}
                />
              </div>
              {isInstallmentsAvaliable() ? (
                <div>
                  <Typography mb={1} fontSize={14}>
                    Parcelas Disponíveis
                  </Typography>
                  <Field name='installments'>
                    {({ field, form }: FieldProps) => (
                      <Select
                        value={form.values.selectedInstallment.quantity}
                        fullWidth
                        variant="outlined"
                      >
                        {field.value.map((value: Installment) => (
                          <MenuItem
                            key={value.quantity}
                            onClick={() => form.setFieldValue('selectedInstallment', value)}
                            value={value.quantity}
                            selected
                          >
                            {` ${value.quantity}x R$ ${value.value.toFixed(2)} (  ${value.hasFee ? ` R$ ${value.total} ` : ' Sem juros '
                              } )
                             `}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  </Field>
                </div>
              ) : (<MinValueToInstallmentsCard />)}
            </Stack>
          </Grid>
        </React.Fragment>
      </Grid>
    </React.Fragment>
  )
}
