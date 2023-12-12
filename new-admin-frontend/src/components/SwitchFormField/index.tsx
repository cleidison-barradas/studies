import { FormControl, FormControlLabel, Switch, withStyles } from '@material-ui/core'
import { FieldProps } from 'formik'
import React, { Component } from 'react'
import styles from './styles'

interface Props extends FieldProps {
  label?: string
  disabled?: boolean
  classes: Record<keyof ReturnType<typeof styles>, string>
  labelPlacement?: 'end' | 'bottom' | 'top' | 'start' | undefined
}

interface State {
  notifySwitchState: boolean
}

class SwitchFormField extends Component<Props, State> {

  state: State = {
    notifySwitchState: false
  }

  render() {
    const { field, form, classes, label, disabled, labelPlacement = 'end' } = this.props
    return (
      <FormControl className={classes.switchTextBox} >
        <FormControlLabel
          label={label}
          disabled={disabled}
          labelPlacement={labelPlacement}
          control={
            <Switch
              checked={field.value}
              onChange={(_, checked) => {
                form.setFieldValue(field.name, checked)

                const state = this.state
                state.notifySwitchState = !state.notifySwitchState
                this.setState(state)
              }}
              color="default"
            />
          }
        />
      </FormControl>
    )
  }
}

export default withStyles(styles)(SwitchFormField)