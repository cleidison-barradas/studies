import { Box, Grid, Typography, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import PaperBlock from '../../PaperBlock'

import { ReactComponent as DownloadIcon } from '../../../assets/images/icons/download.svg'
import style from './style'
import downloads from './downloads.json'
import classNames from 'classnames'

type Props = {
    classes: any
    mode: any
}

class DownloadsPaper extends Component<Props> {
    render() {
        const { classes } = this.props
        return (
            <div>
                <PaperBlock>
                    <Grid container spacing={3}>
                        {downloads.map((download: any, index: number) => (
                            <Grid item lg={4} md={6} xs={12} sm={12} key={index}>
                                <Typography className={classes.title}> {download.name} </Typography>
                                <div
                                    className={classes.item}
                                    style={{
                                        backgroundImage: `url(${require(`../../../assets/images/ilustration/${download.image}`)})`,
                                        backgroundPosition: 'center',
                                        backgroundSize: '101% 101%',
                                        backgroundRepeat: 'no-repeat',
                                    }}
                                >
                                    {download.link ? (
                                        <a className={classNames(classes.download)} href={download.link} download>
                                            <Typography color="inherit">Baixar Software</Typography>
                                            <DownloadIcon />
                                        </a>
                                    ) : (
                                        <div className={classNames(classes.download, classes.nopointer)}>
                                            <Grid container spacing={3} alignItems="center" justify="center">
                                                {download.links.map((links: any, key: number) => (
                                                    <Grid item key={key}>
                                                        <a href={links.link} className={classes.link}>
                                                            {' '}
                                                            {links.name}{' '}
                                                        </a>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                            <Box mt={2}>
                                                <DownloadIcon />
                                            </Box>
                                        </div>
                                    )}
                                </div>
                                <Typography className={classes.description}> {download.description} </Typography>
                            </Grid>
                        ))}
                    </Grid>
                </PaperBlock>
            </div>
        )
    }
}

export default withStyles(style)(DownloadsPaper)
