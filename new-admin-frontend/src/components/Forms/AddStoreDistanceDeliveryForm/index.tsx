import { Component } from 'react'
import { Grid, Typography, withStyles } from '@material-ui/core'
import { Field, FieldProps, FormikErrors, FormikTouched } from 'formik'

// interfaces
import DistanceDeliveryFee from '../../../interfaces/distanceDeliveryFee'
// Custom inputs
import CurrencyTextField from '../../CurrencyTextField'

import styles from './styles'
import ContainerErrors from '../../ContainerErrors'
import CustomSlider from '../../CustomSlider'
// @ts-ignore
import NumberFormField from '../../NumberFormField'




interface Props {
  errors: FormikErrors<DistanceDeliveryFee | undefined>
  touched: FormikTouched<DistanceDeliveryFee | undefined>
  handleNewDistanceFeeFieldChange: (field: string, value: any) => void
  classes: Record<keyof ReturnType<typeof styles>, string>
  distanceDeliveries: DistanceDeliveryFee[]
  newDistanceDeliveryFee: DistanceDeliveryFee | null
}

class AddStoreDistanceDelivery extends Component<Props> {
  static defaultProps = {
    errors: {},
    newDistanceDeliveryFee: {
      _id: '0',
      deliveryTime: 0,
      feePrice: 0,
      freeFrom: 0,
      minimumPurchase: 0,
      distance: 0
    }
  }

  render() {
    const { classes, newDistanceDeliveryFee, handleNewDistanceFeeFieldChange, errors } = this.props
    const distance = newDistanceDeliveryFee?.distance || 1

    return (
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item style={{ alignSelf: 'flex-end' }}>
            <Typography className={classes.caption} gutterBottom>
              Distância:
            </Typography>
          </Grid>
          <Grid item xs={8} style={{ alignSelf: 'flex-end' }}>
            <div className={classes.sliderCirculation}>
              <Field name="distance">
                {({ form }: FieldProps) => (
                  <CustomSlider
                    value={distance}
                    onChange={(event, value) => {
                      let metersDistance = 0
                      if (typeof value === 'number') metersDistance = value * 1000

                      form.setFieldValue('distance', metersDistance)
                      handleNewDistanceFeeFieldChange('distance', value)
                    }}
                    min={1}
                    max={150}
                    step={1}
                    aria-label="Distance"
                    valueLabelDisplay="auto"
                  />
                )}
              </Field>
            </div>
          </Grid>
          <Grid item xs={2} style={{ alignSelf: 'flex-end' }}>
            <Field name="distance">
                {({ form }: FieldProps) => (
                    <Field
                      name="distance"
                      type="number"
                      label="Distância (Km)"
                      value={newDistanceDeliveryFee?.distance}
                      component={NumberFormField}
                      inputProps={{
                        step: 1,
                        min: 0,
                        max: 150,
                        type: 'number',
                        'aria-labelledby': 'input-slider',
                        style: {
                          width: '100%',
                          fontSize: '100%',
                        },
                      }}
                      onChange={(event: { target: { value: string } }) => {
                        const distance = Math.min(parseInt(event.target.value, 10), 150)
                        const metersDistance = distance * 1000
                        form.setFieldValue('distance', metersDistance)
                        handleNewDistanceFeeFieldChange('distance', distance)
                      }}
                    />
                )}
              </Field>
          </Grid>
          <Grid item xs={3}>
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
                    handleNewDistanceFeeFieldChange("feePrice", floatValue)
                  }}
                />
              )}
            </Field>
            <ContainerErrors errors={errors} name="feePrice" />
          </Grid>
          <Grid item xs={3}>
            <Field name="freeFrom">
              {({ field, form }: FieldProps) => (
                <CurrencyTextField
                  prefix="R$ "
                  label="Grátis a Partir"
                  value={field.value}
                  thousandSeparator="."
                  decimalSeparator=","
                  className={classes.inputs}
                  onChange={({ floatValue }) => {
                    form.setFieldValue('freeFrom', floatValue)
                    handleNewDistanceFeeFieldChange("freeFrom", floatValue)
                  }}
                />
              )}
            </Field>
            <ContainerErrors errors={errors} name="freeFrom" />
          </Grid>
          <Grid item xs={3}>
            <Field name="deliveryTime">
              {({ form }: FieldProps) => (
                  <Field
                    name="deliveryTime"
                    component={NumberFormField}
                    type="number"
                    label="Tempo de Entrega (min)"
                    inputProps={{
                      step: 1,
                      min: 0,
                      type: 'number',
                      'aria-labelledby': 'input-slider',
                      style: {
                        width: '100%', // Adjust the width as needed
                        fontSize: '100%',
                      },
                    }}
                    onChange={(event: { target: { value: string } }) => {
                      let time = parseInt(event.target.value, 10)
                      if (isNaN(time)) {
                        time = 0
                      }
                      form.setFieldValue('deliveryTime', time)
                      handleNewDistanceFeeFieldChange('deliveryTime', time)
                    }}
                  />
              )}
            </Field>
          </Grid>
          <Grid item xs={3}>
            <Field name="minimumPurchase"
            >
              {({ field, form }: FieldProps) => (
                <CurrencyTextField
                  prefix="R$ "
                  label="Minímo para Entrega"
                  value={field.value}
                  thousandSeparator="."
                  decimalSeparator=","
                  className={classes.inputs}
                  onChange={({ floatValue }) => {
                    form.setFieldValue('minimumPurchase', floatValue)
                    handleNewDistanceFeeFieldChange("minimumPurchase", floatValue)
                  }}
                />
              )}
            </Field>
            <ContainerErrors errors={errors} name="minimumPurchase" />
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles)(AddStoreDistanceDelivery)
