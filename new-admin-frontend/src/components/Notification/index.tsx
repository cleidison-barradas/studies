import { Popover, Typography, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import style from './style'

type Props = {
    show: any,
    classes: any,
    anchorEl: any,
    handleClose: any,
}

class Notification extends Component<Props> {
    render() {

        const { classes, show, anchorEl, handleClose } = this.props
        const id = show ? 'simple-popover' : undefined

        return (
            <Popover
                id={id}
                open={show}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                classes={{
                    paper : classes.container
                }}
            >
                <Typography className={classes.typography}>Uma compra foi retornada</Typography>
            </Popover>
        )
    }
}

export default withStyles(style)(Notification)