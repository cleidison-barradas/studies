import { Typography, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import DownloadsPaper from '../../components/Papers/DownloadsPaper'
import customerxService from '../../services/customerx.service'
import style from './style'

type Props = {
    classes: any,
    mode: any,
}

class Downloads extends Component<Props> {


    componentDidMount() {
        customerxService.trackingScreen()
    }

    render() {
        const { classes,mode } = this.props
        return (
            <>
                <Typography className={classes.headertxt} >Downloads</Typography>
                <DownloadsPaper mode={mode} />
            </>
        )
    }
}

export default withStyles(style)(Downloads)