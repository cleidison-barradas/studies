import { FormControl, FormControlLabel, Switch, withStyles } from '@material-ui/core'
import { FieldProps } from 'formik'
import React, { Component } from 'react'
import styles from './styles'

interface Props extends FieldProps {
    classes: Record<keyof ReturnType<typeof styles>, string>
    label?: string
    labelPlacement?: 'end' | 'bottom' | 'top' | 'start' | undefined
}

class SwitchFormField extends Component<Props> {
    render() {
        const { field, form, label, labelPlacement = 'end' } = this.props
        return (
            <FormControl>
                <FormControlLabel
                    label={label}
                    labelPlacement={labelPlacement}
                    control={
                        <Switch
                            checked={field.value}
                            onChange={(_, checked) => {
                                form.setFieldValue(field.name, checked)
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
