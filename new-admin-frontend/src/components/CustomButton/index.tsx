import { CircularProgress, withStyles } from '@material-ui/core'
import classNames from 'classnames'
import React, { Component } from 'react'
import style from './style'

type Props = {
    classes: any,
    loading: boolean,
    buttonClassName: any,
    click: any,
    buttonText: any,
    success?: boolean,
    disabled: boolean,
    error?: boolean,
}

class CustomButton extends Component<Props> {

    static defaultProps = {
        success : false,
        error : false,
    }

    render() {
        const { classes, loading, buttonClassName, click, buttonText, success, disabled, error } = this.props
        return (
            <div className={classes.root}>
                <div className={classes.wrapper}>
                    <button
                        className={classNames(
                            buttonClassName,
                            success ? classes.buttonSuccess : '',
                            error ? classes.buttonError : ''
                        )}
                        disabled={loading || disabled}
                        onClick={click}
                    >
                        {
                            loading ? <CircularProgress size={24} className={classes.buttonProgress} classes={{colorPrimary : classes.colorPrimary}}  /> : buttonText
                        }
                    </button>
                </div>
            </div>
        )
    }
}

export default withStyles(style)(CustomButton)
