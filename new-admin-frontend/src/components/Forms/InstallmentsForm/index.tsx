import React, { ChangeEvent, Component } from 'react'
import { Field, FieldProps, FormikContext, } from 'formik'
import { Box, Button, FormControl, FormControlLabel, Grid, MenuItem, Switch, Typography, withStyles } from '@material-ui/core'

import SelectFormField from '../../SelectFormField'
import CurrencyTextField from '../../CurrencyTextField'
import SwitchFormField from '../../SwitchFormField'
import StoneInstallmentsFeePerFlagTable from '../../Tables/StoneInstallmentsFeePerFlagTable'

import InstallmentsFeeDialog from '../../Dialogs/InstallmentsFee'
import StoneFeeConfigDialog from '../../Dialogs/StoneFeeConfigDialog'

import { StoreConsumer, StoreProvider } from '../../../context/StoreContext'

import styles from './styles'

const storeBetaTesters = [
  'farmaciaabarateira',
  'farmaciasantoandre',
  'novamypharma',
  'mypharmatesteimplantacao',
  'alpha-ecommercemypharma'
]

interface Props {
  maxInstallmentsAllowed: number
  classes: Record<keyof ReturnType<typeof styles>, string>
}

interface State {
  isModalOpen: boolean
  isConfigModalOpen: boolean
}

function Error({ message }: any) {
  return (
    <div style={{ paddingLeft: 10, paddingTop: 3 }}>
      <Typography style={{ color: '#FF5353' }} >{message || 'error'}</Typography>
    </div>
  )
}

export class InstallmentsForm extends Component<Props, State> {
  static contextType = FormikContext

  state: State = {
    isModalOpen: false,
    isConfigModalOpen: false,
  }

  handleApplyFeeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target

    if (name === 'paymentMethod.installmentsDetails.applyInstallmentsFee' && !checked) {
      this.setState({ isModalOpen: false })
      this.context.setFieldValue('paymentMethod.installmentsDetails.applyInstallmentsFee', false)
    } else {
      this.setState({ isModalOpen: true })
    }
  }

  handleCloseModal = () => {
    this.setState({ isModalOpen: false })
    this.setState({ isConfigModalOpen: false })
    this.context.setFieldValue('paymentMethod.installmentsDetails.applyInstallmentsFee', false)
  }

  handleConfirmModal = () => {
    this.setState({ isModalOpen: false })
    this.setState({ isConfigModalOpen: true })
    this.context.setFieldValue('paymentMethod.installmentsDetails.applyInstallmentsFee', true)
  }

  handleOpenConfigModal = () => {
    this.setState({ isConfigModalOpen: true })
  }

  handleConfirmConfigModal = () => {
    this.setState({ isConfigModalOpen: false })
  }

  render() {
    const { values } = this.context
    const { classes, maxInstallmentsAllowed } = this.props

    return (
      <StoreProvider>
        <StoreConsumer>
          {({ store }) => {
            const tenant = store?.tenant || ''

            return (
              <>
                <Box mt={2}>
                  <Grid container spacing={3} direction='column'>
                    <Grid item>
                      <Typography className={classes.caption}>
                        Escolha o limite de parcelas para os seus clientes.
                      </Typography>
                    </Grid>
                    <Grid item md={4}>
                      <Field
                        label='Quantidade máxima de parcelas'
                        name='paymentMethod.installmentsDetails.maxInstallments'
                        className={classes.textfield}
                        variant='outlined'
                        component={SelectFormField}
                        fullWidth
                      >
                        {[...Array(maxInstallmentsAllowed)].map((_, index) => {
                          const text = `em até ${index + 1}x`
                          return (
                            <MenuItem value={index + 1} key={index}>
                              {index === 0 ? 'Somente à vista' : text}
                            </MenuItem>
                          )
                        })}
                      </Field>
                    </Grid>
                    {values.paymentMethod?.installmentsDetails.maxInstallments > 1 && (
                      <>
                        <Grid item md={4}>
                          <Box
                            className={classes.switch}
                            style={{
                              background: values.paymentMethod.installmentsDetails.minValueToInstallmentsFlag ? 'rgba(88, 207, 178, 0.25)' : 'rgba(184, 197, 208, 0.25)',
                            }}
                          >
                            <Field
                              label='Aplicar valor mínimo para ativar o parcelamento?'
                              component={SwitchFormField}
                              name='paymentMethod.installmentsDetails.minValueToInstallmentsFlag'
                            />
                          </Box>
                        </Grid>
                        {values.paymentMethod?.installmentsDetails.minValueToInstallmentsFlag && (
                          <Grid item md={4}>
                            <Field name='paymentMethod.installmentsDetails.minValueToInstallments'>
                              {({ field, form, meta }: FieldProps) => {
                                return (
                                  <>
                                    <CurrencyTextField
                                      prefix='R$ '
                                      label='Valor mínimo para parcelamento'
                                      className={classes.minValueInput}
                                      thousandSeparator='.'
                                      decimalSeparator=','
                                      onChange={({ floatValue }) =>
                                        form.setFieldValue('paymentMethod.installmentsDetails.minValueToInstallments', floatValue)
                                      }
                                      value={field.value}
                                    />
                                    {meta.touched && meta.error && <Error message={meta.error} />}
                                  </>
                                )
                              }}
                            </Field>
                          </Grid>
                        )}
                        {storeBetaTesters.includes(tenant) && (
                          <Grid item md={4}>
                            <Box
                              className={classes.switch}
                              style={{
                                background: values.paymentMethod.installmentsDetails.applyInstallmentsFee ? 'rgba(88, 207, 178, 0.25)' : 'rgba(184, 197, 208, 0.25)',
                              }}
                            >
                              <Field name='paymentMethod.installmentsDetails.applyInstallmentsFee'>
                                {({ field }: FieldProps) => (
                                  <FormControl>
                                    <FormControlLabel
                                      label='Cobrar Juros das parcelas do Cliente?'
                                      control={
                                        <Switch
                                          checked={field.value}
                                          onChange={(e) => {
                                            field.onChange(e)
                                            this.handleApplyFeeChange(e)
                                          }}
                                          color='default'
                                        />
                                      }
                                    />
                                  </FormControl>
                                )}
                              </Field>
                            </Box>
                          </Grid>
                        )}
                        {values.paymentMethod?.installmentsDetails.applyInstallmentsFee && (
                          <>
                            <Grid item md={4}>
                              <Field
                                label='Aplicar taxa a partir da: '
                                name='paymentMethod.installmentsDetails.applyInstallmentsFeeFrom'
                                className={classes.freeFeeTax}
                                variant='outlined'
                                component={SelectFormField}
                                fullWidth
                              >
                                {[...Array(values.paymentMethod.installmentsDetails.maxInstallments)].map((_, index) => (
                                  <MenuItem value={index + 1} key={index}>
                                    {`${index + 1}ª parcela`}
                                  </MenuItem>
                                ))}
                              </Field>
                            </Grid>
                          </>
                        )}
                      </>
                    )}
                  </Grid>
                </Box>
                {values.paymentMethod?.installmentsDetails.applyInstallmentsFee && values.paymentMethod?.installmentsDetails.manualFee && (
                  <Grid item>
                    <StoneInstallmentsFeePerFlagTable
                      stoneCardFlagFee={values.paymentMethod?.installmentsDetails.cardsFlagFee}
                      maxInstallments={values.paymentMethod?.installmentsDetails.maxInstallments}
                    />
                    <Grid item md={4}>
                      <Button
                        onClick={this.handleOpenConfigModal}
                        fullWidth
                        style={{
                          backgroundColor: '#A3A0AC',
                          padding: '8px 16px',
                          color: '#F9FAFF'
                        }}
                        variant='contained'
                      >
                        Configurar taxas
                      </Button>
                    </Grid>
                  </Grid>
                )}
                <InstallmentsFeeDialog
                  isManualFee={values.paymentMethod?.installmentsDetails.manualFee}
                  isOpen={this.state.isModalOpen}
                  onClose={this.handleCloseModal}
                  onConfirm={this.handleConfirmModal}
                />
                <StoneFeeConfigDialog
                  isOpen={this.state.isConfigModalOpen}
                  onClose={this.handleCloseModal}
                  onConfirm={this.handleConfirmConfigModal}
                />
              </>
            )
          }}
        </StoreConsumer>
      </StoreProvider>
    )
  }
}

export default withStyles(styles)(InstallmentsForm)
