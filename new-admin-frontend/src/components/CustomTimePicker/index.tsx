import React, { Component } from 'react'
import DateMomentUtils from '@date-io/date-fns'
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
} from '@material-ui/pickers'
import { withStyles } from '@material-ui/core'
import style from './style'
import classNames from 'classnames'
import AccessTimeIcon from '@material-ui/icons/AccessTime'

type Props = {
    value?: any,
    onChange?: any,
    classes: any,
    customClass?: any,
    disabled?: boolean,
    label?: any,
    variant?: any
}

class CustomTimePicker extends Component<Props> {
    render() {

        const { value, onChange, classes, customClass, disabled, label, variant } = this.props

        return (
            <MuiPickersUtilsProvider utils={DateMomentUtils}>
                <KeyboardTimePicker
                    value={value}
                    onChange={onChange}
                    className={classNames(classes.clock, customClass)}
                    InputAdornmentProps={{
                        className: classes.inputAdornmentProps,
                    }}
                    variant={variant}
                    label={label}
                    inputProps={{
                        className: classes.input
                    }}
                    ampm={false}
                    disabled={disabled}
                    keyboardIcon={<AccessTimeIcon style={{ fill: '#93A0AC' }} />}
                />
            </MuiPickersUtilsProvider>
        )
    }
}
export default withStyles(style)(CustomTimePicker)
